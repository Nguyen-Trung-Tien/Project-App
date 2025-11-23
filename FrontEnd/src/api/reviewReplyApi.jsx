import axiosClient from "../utils/axiosClient";

export const getRepliesByReviewApi = async (reviewId) => {
  try {
    const res = await axiosClient.get(`/review-reply/review/${reviewId}`);
    return res.data;
  } catch (err) {
    console.error(err);
    return { errCode: 1, errMessage: "Không thể lấy reply" };
  }
};

export const createReplyApi = async (payload, token) => {
  try {
    const res = await axiosClient.post(`/review-reply/create`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error(err);
    return { errCode: 1, errMessage: "Không thể tạo reply" };
  }
};

export const deleteReplyApi = async (replyId, token) => {
  try {
    const res = await axiosClient.delete(`/review-reply/${replyId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error(err);
    return { errCode: 1, errMessage: "Không thể xóa reply" };
  }
};
