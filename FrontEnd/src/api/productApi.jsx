import axios from "axios";
import axiosClient from "../utils/axiosClient";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getAllProductApi = async (page = 1, limit = 10, search = "") => {
  try {
    const res = await API.get(`/product/get-all-product`, {
      params: { page, limit, search },
    });
    return res.data;
  } catch (err) {
    console.error("Get All Product API error:", err);
    throw err;
  }
};

export const getProductByIdApi = async (id) => {
  try {
    const res = await API.get(`/product/get-product/${id}`);
    return res.data;
  } catch (err) {
    console.error("Get product by ID API error:", err);
    throw err;
  }
};

export const createProductApi = async (data, token) => {
  try {
    const res = await axiosClient.post(`/product/create-new-product`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (err) {
    console.error("Create product API error:", err);
    throw err;
  }
};

export const updateProductApi = async (id, data, token) => {
  try {
    const res = await axiosClient.put(`/product/update-product/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (err) {
    console.error("Update product API error:", err);
    throw err;
  }
};

export const deleteProductApi = async (id, token) => {
  try {
    const res = await axiosClient.delete(`/product/delete-product/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error("Delete product API error:", err);
    throw err;
  }
};

export const getProductsByCategoryApi = async (
  categoryId,
  page = 1,
  limit = 11
) => {
  try {
    const res = await API.get(
      `/product/product-by-category?categoryId=${categoryId}&page=${page}&limit=${limit}`
    );
    return res.data;
  } catch (error) {
    console.error(`Error getting products by category ${categoryId}:`, error);
    throw error;
  }
};

export const searchProductsApi = async (query, page = 1, limit = 10) => {
  try {
    const res = await API.get(
      `/product/search?q=${encodeURIComponent(
        query
      )}&page=${page}&limit=${limit}`
    );
    return res.data;
  } catch (err) {
    console.error("Search products API error:", err);
    throw err;
  }
};

export const getDiscountedProductsApi = async (page = 1, limit = 6) => {
  try {
    const res = await API.get(`/product/discounted`, {
      params: { page, limit },
    });
    return res.data;
  } catch (err) {
    console.error("Get discounted products API error:", err);
    throw err;
  }
};
