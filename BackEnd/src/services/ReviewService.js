const db = require("../models");

const getReviewsByProduct = async (productId, page = 1, limit = 10) => {
  try {
    const offset = (page - 1) * limit;

    const { count, rows } = await db.Review.findAndCountAll({
      where: { productId, isApproved: true },
      include: [
        {
          model: db.User,
          as: "user",
          attributes: ["id", "username", "avatar"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: limit,
      offset: offset,
    });

    return {
      errCode: 0,
      data: rows,
      pagination: {
        total: count,
        page: page,
        limit: limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  } catch (error) {
    console.error(error);
    return { errCode: 1, errMessage: "Error from server!" };
  }
};

const createReview = async (data) => {
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

module.exports = { createReview, getReviewsByProduct };
