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

    const reviewIds = rows.map((r) => r.id);
    let repliesByReviewId = {};
    if (reviewIds.length > 0) {
      const replies = await db.ReviewReply.findAll({
        where: { reviewId: reviewIds },
        include: [
          {
            model: db.User,
            as: "user",
            attributes: ["id", "username", "avatar"],
          },
        ],
        order: [["createdAt", "ASC"]],
      });

      repliesByReviewId = replies.reduce((acc, rep) => {
        const key = rep.reviewId;
        if (!acc[key]) acc[key] = [];
        acc[key].push(rep);
        return acc;
      }, {});
    }

    return {
      errCode: 0,
      data: rows.map((r) => ({
        ...r.toJSON(),
        replies: repliesByReviewId[r.id] || [],
      })),
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

const updateReview = async (reviewId, data, user) => {
  try {
    const review = await db.Review.findByPk(reviewId);

    if (!review) return { errCode: 2, errMessage: "Review không tồn tại" };

    if (user.role !== "admin" && review.userId !== user.id) {
      return {
        errCode: 3,
        errMessage: "Bạn không có quyền chỉnh sửa review này",
      };
    }

    review.rating = data.rating ?? review.rating;
    review.comment = data.comment ?? review.comment;

    await review.save();

    return { errCode: 0, data: review };
  } catch (error) {
    console.error(error);
    return { errCode: 1, errMessage: "Lỗi khi cập nhật đánh giá" };
  }
};

const deleteReview = async (reviewId, user) => {
  try {
    const review = await db.Review.findByPk(reviewId);

    if (!review) return { errCode: 2, errMessage: "Review không tồn tại" };

    if (user.role !== "admin" && review.userId !== user.id) {
      return { errCode: 3, errMessage: "Bạn không có quyền xóa review này" };
    }

    await review.destroy();

    return { errCode: 0, message: "Đã xóa đánh giá" };
  } catch (error) {
    console.error(error);
    return { errCode: 1, errMessage: "Lỗi khi xóa đánh giá" };
  }
};

const getAllReviewsAdmin = async (
  page = 1,
  limit = 10,
  rating = "",
  status = ""
) => {
  try {
    const where = {};
    const offset = (page - 1) * limit;

    if (rating) where.rating = rating;

    if (status) {
      where.isApproved = status === "approved";
    }

    const { count, rows } = await db.Review.findAndCountAll({
      where,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: db.User,
          as: "user",
          attributes: ["id", "username"],
        },
        {
          model: db.Product,
          as: "product",
          attributes: ["id", "name"],
        },
      ],
    });

    return {
      errCode: 0,
      data: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    };
  } catch (error) {
    console.error("Get All Reviews Admin Error:", error);
    return { errCode: 1, errMessage: "Lỗi server" };
  }
};
module.exports = {
  createReview,
  getReviewsByProduct,
  deleteReview,
  updateReview,
  getAllReviewsAdmin,
};
