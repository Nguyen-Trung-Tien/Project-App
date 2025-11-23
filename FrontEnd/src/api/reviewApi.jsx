import axios from "axios";
import axiosClient from "../utils/axiosClient";

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

export const createReviewApi = async (payload, token) => {
  try {
    const res = await axiosClient.post(`/review/create`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error(err);
  }
};

export const updateReviewApi = async (reviewId, payload, token) => {
  try {
    const res = await axiosClient.put(`review/update/${reviewId}`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error("Lỗi cập nhật đánh giá:", err);
    return { errCode: 1, errMessage: "Cập nhật đánh giá thất bại" };
  }
};

export const deleteReviewApi = async (reviewId, token) => {
  try {
    const res = await axiosClient.delete(`review/delete/${reviewId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error("Lỗi xóa đánh giá:", err);
    return { errCode: 1, errMessage: "Xóa đánh giá thất bại" };
  }
};

export const getAllReviewsApi = async (
  page = 1,
  limit = 10,
  rating = "",
  status = "",
  token
) => {
  try {
    const res = await axiosClient.get(`/review/get-all`, {
      params: { page, limit, rating, status },
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error("Lỗi khi lấy tất cả đánh giá:", err);
    return { errCode: 1, errMessage: "Không thể tải đánh giá" };
  }
};
