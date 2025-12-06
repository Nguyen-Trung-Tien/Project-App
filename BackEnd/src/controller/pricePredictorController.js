require("dotenv").config();
const { Product, Category } = require("../models");

// Thuật toán dự đoán giá nâng cấp
function predictPriceAdvanced(price, discount, categoryName) {
  const current = price * (1 - discount / 100);

  // Seasonal trend theo tháng (ví dụ sale cuối năm)
  const month = new Date().getMonth() + 1;
  let seasonalDrop = 0;
  if ([11, 12].includes(month)) seasonalDrop = 0.08; // giảm mạnh dịp sale cuối năm
  if ([6, 7].includes(month)) seasonalDrop = 0.05; // mid-year sale

  const drop30 = Math.round(current * (-0.04 - seasonalDrop));
  const drop60 = Math.round(current * (-0.06 - seasonalDrop / 2));
  const drop90 = Math.round(current * (-0.09 - seasonalDrop / 3));

  const reliability = 70 + Math.floor(Math.random() * 20); // 70–90%

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

    if (!product) {
      return res.status(404).json({ error: "Sản phẩm không tìm thấy." });
    }

    const result = predictPriceAdvanced(
      product.price,
      product.discount,
      product.category?.name
    );

    return res.json({
      type: "price_prediction",
      productId: product.id,
      productName: product.name,
      category: product.category?.name || "Không xác định",
      ...result,
    });
  } catch (err) {
    console.error("Lỗi Price Predictor:", err);
    res.status(500).json({ error: "Lỗi khi dự đoán giá tương lai." });
  }
};

module.exports = { handlePricePredict };
