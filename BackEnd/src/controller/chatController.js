require("dotenv").config();
const OpenAI = require("openai");
const { Product, Order, Category, OrderItem } = require("../models");
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

    const intentResult = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
Bạn là bộ phân loại ý định. Chỉ trả về JSON.  
Các intent hợp lệ:
- product_search
- product_price
- product_stock
- product_compare
- product_suggestion
- order_status
- order_by_id
- warranty
- shipping
- return_policy
- payment_method
- smalltalk
- other

Hãy phân tích câu hỏi và trả về:
{ "intent": "...", "product": "..." }
Nếu không có sản phẩm, đặt product = "".
`,
        },
        { role: "user", content: message },
      ],
      temperature: 0,
    });

    const parsedIntent = JSON.parse(intentResult.choices[0].message.content);
    const intent = parsedIntent.intent;
    const productNameAI = parsedIntent.product?.trim() || "";

    let dbContext = "";
    let product = null;

    if (productNameAI) {
      product = await Product.findOne({
        where: { name: { [Op.like]: `%${productNameAI}%` }, isActive: true },
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

    if (intent === "order_status" && userId) {
      const order = await Order.findOne({
        where: { userId },
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: OrderItem,
            as: "orderItems",
            include: [Product],
          },
        ],
      });

      if (order) {
        const items = order.orderItems
          .map((i) => `${i.quantity}x ${i.Product.name}`)
          .join(", ");

        dbContext += `

Đơn hàng gần nhất:
- Mã đơn: #${order.id}
- Trạng thái: ${translateStatus(order.status)}
- Tổng tiền: ${formatPrice(order.totalPrice)} ₫
- Sản phẩm: ${items}
- Địa chỉ: ${order.shippingAddress}
        `.trim();
      } else {
        dbContext += "\nBạn chưa có đơn hàng nào.";
      }
    }

    if (intent === "order_by_id") {
      const orderId = message.match(/\d+/)?.[0];

      if (orderId) {
        const order = await Order.findOne({
          where: { id: orderId },
          include: [
            {
              model: OrderItem,
              as: "orderItems",
              include: [Product],
            },
          ],
        });

        if (order) {
          const items = order.orderItems
            .map((i) => `${i.quantity}x ${i.Product.name}`)
            .join(", ");

          dbContext += `
Thông tin đơn #${order.id}:
- Trạng thái: ${translateStatus(order.status)}
- Tổng tiền: ${formatPrice(order.totalPrice)} ₫
- Sản phẩm: ${items}
- Địa chỉ: ${order.shippingAddress}
          `.trim();
        } else {
          dbContext += `Không tìm thấy đơn hàng #${orderId}.`;
        }
      }
    }

    const systemPrompt = `
Bạn là trợ lý AI của TienTech Shop.
Trả lời thân thiện, tự nhiên, rõ ràng.
Nếu có dữ liệu trong DB thì dùng để trả lời nhưng **không nói “dựa theo dữ liệu bạn gửi”**.

Dữ liệu truy vấn:
${dbContext || "(không có dữ liệu)"}

Luôn trả lời bằng tiếng Việt.
`.trim();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      temperature: 0.7,
      max_tokens: 350,
    });

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
