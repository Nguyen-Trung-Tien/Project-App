const {
  getReviewsByProduct,
  createReview,
} = require("../services/ReviewService");

exports.handleGetReviewsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const data = await getReviewsByProduct(productId);
    return res.status(200).json(data);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ errCode: -1, errMessage: "Lỗi server" });
  }
};

exports.handleCreateReview = async (req, res) => {
  try {
    const data = await createReview(req.body);
    return res.status(200).json(data);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ errCode: -1, errMessage: "Lỗi server" });
  }
};
