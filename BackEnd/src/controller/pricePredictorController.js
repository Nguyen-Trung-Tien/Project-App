require("dotenv").config();
const { Product, Category } = require("../models");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const geminiModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

function sanitizeGeminiJSON(text) {
  if (!text) return null;

  text = text.replace(/```json/gi, "");
  text = text.replace(/```/g, "");

  const match = text.match(/\{[\s\S]*\}$/);
  if (match) text = match[0];

  return text.trim();
}

async function analyzeProductWithGemini(product) {
  const prompt = `
Phân tích sản phẩm theo dữ liệu:

Tên: ${product.name}
Giá gốc: ${product.price}
Giảm giá: ${product.discount}%
Danh mục: ${product.category?.name || "Không có"}

Hãy dự đoán:
- Xu hướng giá 30/60/90 ngày tới tại Việt Nam
- Rủi ro giá
- Gợi ý có nên mua không
- Giá hợp lý để mua
- Điểm độ tin cậy 0-100

Trả về JSON THUẦN, không markdown, không giải thích:
{
  "trend": "",
  "suggestion": "",
  "risk": "",
  "fairPrice": 0,
  "reliability": 0
}
  `;

  try {
    const result = await geminiModel.generateContent(prompt);
    let raw = result.response.text();

    raw = sanitizeGeminiJSON(raw);

    return JSON.parse(raw);
  } catch (err) {
    console.error("Gemini parse error:", err);
    return null;
  }
}

function predictPriceAdvanced(price, discount, categoryName) {
  const current = price * (1 - discount / 100);

  const month = new Date().getMonth() + 1;

  let seasonalDrop = 0;
  if ([11, 12].includes(month)) seasonalDrop = 0.08;
  if ([6, 7].includes(month)) seasonalDrop = 0.05;

  const drop30 = Math.round(current * (-0.04 - seasonalDrop));
  const drop60 = Math.round(current * (-0.06 - seasonalDrop / 2));
  const drop90 = Math.round(current * (-0.09 - seasonalDrop / 3));

  const reliability = 70 + Math.floor(Math.random() * 20);

  return {
    currentPrice: current,
    predicted30: drop30,
    predicted60: drop60,
    predicted90: drop90,
    reliability,
  };
}

const handlePricePredict = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ error: "Thiếu productId" });

    const product = await Product.findByPk(productId, {
      include: [{ model: Category, as: "category" }],
    });

    if (!product)
      return res.status(404).json({ error: "Sản phẩm không tìm thấy." });

    const basicPredict = predictPriceAdvanced(
      product.price,
      product.discount,
      product.category?.name
    );

    const aiAnalysis = await analyzeProductWithGemini(product);

    return res.json({
      type: "price_prediction",
      productId: product.id,
      productName: product.name,
      category: product.category?.name || "Không xác định",
      ...basicPredict,
      aiAnalysis: aiAnalysis || { error: "AI phân tích thất bại" },
    });
  } catch (err) {
    console.error("Lỗi Price Predictor:", err);
    return res.status(500).json({
      error: "Lỗi khi dự đoán giá tương lai.",
    });
  }
};

module.exports = { handlePricePredict };
