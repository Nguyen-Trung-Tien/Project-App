require("dotenv").config();
const OpenAI = require("openai");
const { Product, Order, Category, OrderItem, User } = require("../models");
const { Op } = require("sequelize");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const handleChat = async (req, res) => {
  try {
    const { message, userId } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Thiếu nội dung câu hỏi." });
    }

    let dbContext = "";
    let product = null;

    const productMatch = message.match(/(?:sản phẩm|sp|mua|tìm) (.+)/i);
    if (productMatch) {
      const productName = productMatch[1].trim();
      product = await Product.findOne({
        where: { name: { [Op.like]: `%${productName}%` }, isActive: true },
        include: [{ model: Category, as: "category" }],
      });

      if (product) {
        const discountPrice = product.price * (1 - product.discount / 100);
        dbContext += `
Sản phẩm:
- Tên: ${product.name}
- Giá gốc: ${formatPrice(product.price)} ₫
- Giảm giá: ${product.discount}% → Giá hiện tại: ${formatPrice(discountPrice)} ₫
- Kho: ${product.stock > 0 ? product.stock : "Hết hàng"}
- Danh mục: ${product.category?.name || "Không có"}
- Mô tả: ${product.description?.substring(0, 150) || "Không có mô tả"}...
        `.trim();
      }
    }

    // Thêm thông tin đơn hàng gần nhất
    if (userId) {
      const order = await Order.findOne({
        where: { userId },
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: OrderItem,
            as: "orderItems",
            include: [{ model: Product, as: "product" }],
          },
          {
            model: User,
            as: "user",
            attributes: ["id", "username", "email"],
          },
        ],
      });

      if (order) {
        const items = order.orderItems
          .map((i) => `${i.product.name} x${i.quantity}`) // dùng alias 'product'
          .join(", ");
        dbContext += `
Đơn hàng gần nhất:
- Mã đơn: #${order.id}
- Trạng thái: ${translateStatus(order.status)}
- Tổng tiền: ${formatPrice(order.totalPrice)} ₫
- Sản phẩm: ${items}
- Người đặt: ${order.user?.username || "Không có"} (ID: ${
          order.user?.id || "N/A"
        })
- Email: ${order.user?.email || "N/A"}
- Địa chỉ: ${order.shippingAddress}
        `.trim();
      } else {
        dbContext += "\nBạn chưa có đơn hàng nào.";
      }
    }

    const systemPrompt = `
Bạn là trợ lý AI của TienTech Shop.
Phân tích câu hỏi của người dùng, xác định intent và trả lời thân thiện, tự nhiên, rõ ràng.
Nếu có dữ liệu trong DB thì dùng để trả lời nhưng **không nói “dựa theo dữ liệu bạn gửi”**.

Dữ liệu truy vấn:
${dbContext || "(không có dữ liệu)"}

Luôn trả lời bằng tiếng Việt.
`;

    let completion;
    try {
      completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
        temperature: 0.7,
        max_tokens: 400,
      });
    } catch (err) {
      if (err.code === "rate_limit_exceeded") {
        return res.json({
          reply:
            "Hiện tại AI đang bận vì quá nhiều yêu cầu, vui lòng thử lại sau 20 giây ⏳",
        });
      } else {
        throw err;
      }
    }

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("Lỗi chatbot:", error);
    res.status(500).json({ error: "Lỗi khi xử lý yêu cầu AI." });
  }
};

function formatPrice(price) {
  return parseFloat(price).toLocaleString("vi-VN");
}

function translateStatus(status) {
  const map = {
    pending: "Chờ xử lý",
    confirmed: "Đã xác nhận",
    processing: "Đang xử lý",
    shipped: "Đang giao",
    delivered: "Đã giao",
    cancelled: "Đã hủy",
  };
  return map[status] || status;
}

module.exports = { handleChat };
