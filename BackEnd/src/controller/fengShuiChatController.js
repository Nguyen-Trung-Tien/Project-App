require("dotenv").config();
const OpenAI = require("openai");
const { Product, Brand, Category } = require("../models");
const { Op } = require("sequelize");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function getElementByYear(year) {
  const index = (year + 6) % 10;
  switch (index) {
    case 0:
    case 1:
      return "Kim";
    case 2:
    case 3:
      return "Thủy";
    case 4:
    case 5:
      return "Mộc";
    case 6:
    case 7:
      return "Hỏa";
    case 8:
    case 9:
      return "Thổ";
    default:
      return "Thổ";
  }
}

function getLuckyColorsByElement(element) {
  const colorsMap = {
    Kim: ["trắng", "xám", "vàng nhạt"],
    Thủy: ["xanh dương", "đen"],
    Mộc: ["xanh lá", "nâu nhạt"],
    Hỏa: ["đỏ", "cam", "hồng"],
    Thổ: ["vàng đất", "nâu", "cam nhạt"],
  };
  return colorsMap[element] || [];
}

const handleFengShuiChat = async (req, res) => {
  try {
    const { birthYear, message, brandId, categoryId, minPrice, maxPrice } =
      req.body;
    if (!birthYear || !message)
      return res.status(400).json({ error: "Thiếu năm sinh hoặc câu hỏi." });

    const element = getElementByYear(Number(birthYear));
    const luckyColors = getLuckyColorsByElement(element);

    const products = await Product.findAll({
      where: {
        isActive: true,
        color: { [Op.in]: luckyColors },
        ...(brandId && { brandId }),
        ...(categoryId && { categoryId }),
        ...(minPrice && { price: { [Op.gte]: minPrice } }),
        ...(maxPrice && { price: { [Op.lte]: maxPrice } }),
      },
      include: [
        { model: Brand, as: "brand" },
        { model: Category, as: "category" },
      ],
      order: [
        ["sold", "DESC"],
        ["discount", "DESC"],
        ["createdAt", "DESC"],
      ],
      limit: 6,
    });

    let dbContext = `Mệnh: ${element}\nMàu may mắn: ${luckyColors.join(", ")}`;
    if (products.length) {
      dbContext += "\nSản phẩm gợi ý:\n";
      products.forEach((p) => {
        const price = p.price * (1 - p.discount / 100);
        dbContext += `- ${p.name}: ${price.toLocaleString()} ₫, kho: ${
          p.stock > 0 ? p.stock : "Hết hàng"
        }\n`;
      });
    } else dbContext += "\nHiện chưa có sản phẩm phù hợp.";

    const systemPrompt = `
Bạn là trợ lý AI tư vấn phong thủy shop TienTech.
Dữ liệu người dùng và sản phẩm: ${dbContext}
Trả lời bằng tiếng Việt, thân thiện, rõ ràng, gợi ý sản phẩm phù hợp.
`;

    let completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      temperature: 0.7,
      max_tokens: 400,
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error("Lỗi chatbot:", error);
    res.status(500).json({ error: "Lỗi xử lý AI." });
  }
};

module.exports = { handleFengShuiChat };
