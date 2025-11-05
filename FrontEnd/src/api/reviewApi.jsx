import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

export const getReviewsByProductApi = async (productId) => {
  try {
    const res = await axios.get(`${API_URL}/review/product/${productId}`);
    return res.data;
  } catch (err) {
    console.error(err);
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
