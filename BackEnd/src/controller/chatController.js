require("dotenv").config();
const OpenAI = require("openai");
const { Product, Order, Category } = require("../models");
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

    const lowerMsg = message.toLowerCase().trim();

    if (
      lowerMsg.includes("sản phẩm") ||
      lowerMsg.includes("mua") ||
      lowerMsg.includes("giá")
    ) {
      const productName = extractProductName(message);
      if (productName) {
        const product = await Product.findOne({
          where: {
            name: { [require("sequelize").Op.like]: `%${productName}%` },
            isActive: true,
          },
          include: [{ model: Category, as: "category" }],
        });

        if (product) {
          const discountPrice = product.price * (1 - product.discount / 100);
          dbContext = `
Sản phẩm tìm thấy:
- Tên: ${product.name}
- Giá gốc: ${formatPrice(product.price)} ₫
- Giảm giá: ${product.discount}% → Giá hiện tại: ${formatPrice(discountPrice)} ₫
- Kho: ${product.stock > 0 ? `${product.stock} sản phẩm` : "Hết hàng"}
- Danh mục: ${product.category?.name || "Chưa phân loại"}
- Mô tả: ${product.description?.substring(0, 150) || "Không có mô tả"}...
          `.trim();
        } else {
          dbContext = `Không tìm thấy sản phẩm nào phù hợp với "${productName}".`;
        }
      }
    }

    if (
      userId &&
      (lowerMsg.includes("đơn hàng") || lowerMsg.includes("đơn của tôi"))
    ) {
      const order = await Order.findOne({
        where: { userId },
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: require("../models").OrderItem,
            as: "orderItems",
            include: [Product],
          },
        ],
      });

      if (order) {
        const items = order.orderItems
          .map((item) => `${item.quantity}x ${item.Product.name}`)
          .join(", ");
        dbContext += `\n\nĐơn hàng gần nhất của bạn:
- Mã đơn: #${order.id}
- Trạng thái: ${translateStatus(order.status)}
- Tổng tiền: ${formatPrice(order.totalPrice)} ₫
- Sản phẩm: ${items}
- Địa chỉ: ${order.shippingAddress}
        `.trim();
      } else {
        dbContext += `\n\nBạn chưa có đơn hàng nào.`;
      }
    }

    const systemPrompt = `
Bạn là trợ lý AI thân thiện của website "TienTech Shop".
Hỗ trợ khách hàng về: sản phẩm, giá cả, khuyến mãi, đơn hàng, đổi trả, vận chuyển.
Trả lời bằng tiếng Việt, ngắn gọn, tự nhiên, thân thiện.
Dùng dữ liệu sau nếu phù hợp (không cần nói "dựa trên dữ liệu"):

${dbContext}
    `.trim();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("Lỗi chatbot:", error);
    res.status(500).json({
      error: "Lỗi khi xử lý yêu cầu AI.",
      details: error.message,
    });
  }
};

function extractProductName(message) {
  const keywords = ["mua", "giá", "sản phẩm", "có", "bán", "là"];
  const words = message.split(" ").filter((w) => w.length > 2);
  for (let word of words) {
    if (!keywords.includes(word.toLowerCase())) {
      return word.replace(/[^a-zA-Z0-9À-ỹ\s]/g, "");
    }
  }
  return null;
}

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
