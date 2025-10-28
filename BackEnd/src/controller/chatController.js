require("dotenv").config();
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const handleChat = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Thiếu nội dung câu hỏi." });
    }

    const systemPrompt = `
Bạn là trợ lý AI thân thiện của website thương mại điện tử "TienTech Shop".
Hãy hỗ trợ khách hàng về: sản phẩm, chính sách, khuyến mãi, đổi trả, vận chuyển,...
Trả lời bằng tiếng Việt ngắn gọn, tự nhiên và thân thiện.
`;

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
    console.error(" Lỗi chatbot:", error);
    res.status(500).json({
      error: "Lỗi khi xử lý yêu cầu AI.",
      details: error.message,
    });
  }
};

module.exports = { handleChat };
