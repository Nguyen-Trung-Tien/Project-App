import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

export const getReviewsByProductApi = async (
  productId,
  page = 1,
  limit = 10
) => {
  try {
    const res = await axios.get(`${API_URL}/review/product/${productId}`, {
      params: { page, limit },
    });
    return res.data;
  } catch (err) {
    console.error("Lỗi khi lấy đánh giá:", err);
    return { errCode: 1, errMessage: "Không thể tải đánh giá" };
  }
};

export const createReviewApi = async (payload) => {
  try {
    const res = await axios.post(`${API_URL}/review/create`, payload);
    return res.data;
  } catch (err) {
    console.error(err);
  }
};
