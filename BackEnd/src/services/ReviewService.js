const db = require("../models");

exports.getReviewsByProduct = async (productId) => {
  try {
    const reviews = await db.Review.findAll({
      where: { productId, isApproved: true },
      include: [
        {
          model: db.User,
          as: "user",
          attributes: ["id", "username", "avatar"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    return { errCode: 0, data: reviews };
  } catch (error) {
    console.error(error);
    return { errCode: 1, errMessage: "Lỗi khi lấy đánh giá" };
  }
};

exports.createReview = async (data) => {
  try {
    const newReview = await db.Review.create({
      userId: data.userId,
      productId: data.productId,
      rating: data.rating,
      comment: data.comment,
    });
    return { errCode: 0, data: newReview };
  } catch (error) {
    console.error(error);
    return { errCode: 1, errMessage: "Lỗi khi tạo đánh giá" };
  }
};
