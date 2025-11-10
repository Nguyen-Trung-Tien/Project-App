const ReviewService = require("../services/ReviewService");

const handleGetReviewsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const data = await ReviewService.getReviewsByProduct(
      productId,
      page,
      limit
    );
    return res.status(200).json(data);
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

const handleCreateReview = async (req, res) => {
  try {
    const data = await ReviewService.createReview(req.body);
    return res.status(200).json(data);
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

module.exports = { handleGetReviewsByProduct, handleCreateReview };
