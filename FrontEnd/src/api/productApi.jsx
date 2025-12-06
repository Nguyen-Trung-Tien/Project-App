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

export const searchProductsApi = async (query, page = 1, limit = 10) => {
  try {
    const res = await API.get(
      `/product/search?q=${encodeURIComponent(
        query
      )}&page=${page}&limit=${limit}`
    );

    return {
      products: res.data.products || [],
      suggestions: res.data.suggestions || {},
      totalItems: res.data.totalItems || 0,
      currentPage: res.data.currentPage || 1,
      totalPages: res.data.totalPages || 1,
      errCode: res.data.errCode,
    };
  } catch (err) {
    console.error("Search products API error:", err);
    throw err;
  }
};

export const searchSuggestionsApi = async (query) => {
  const res = await API.get(
    `/product/search?q=${encodeURIComponent(query)}&limit=5`
  );
  return res.data;
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

export const filterProductsApi = async ({
  brandId = "",
  categoryId = "",
  minPrice = 0,
  maxPrice = 999999999,
  search = "",
  page = 1,
  limit = 10,
}) => {
  try {
    const res = await API.get("/product/filter", {
      params: {
        brandId,
        categoryId,
        minPrice,
        maxPrice,
        search,
        page,
        limit,
      },
    });

    return res.data;
  } catch (err) {
    console.error("Filter products API error:", err);
    throw err;
  }
};

export const getRecommendedProductsApi = async (
  productId,
  page = 1,
  limit = 6
) => {
  try {
    const res = await API.get(`/product/recommend/${productId}`, {
      params: { page, limit },
    });
    return res.data;
  } catch (err) {
    console.error("Get recommended products API error:", err);
    throw err;
  }
};

export const fetchFortuneProducts = async ({
  birthYear,
  brandId,
  minPrice,
  maxPrice,
  categoryId,
  page,
  limit,
}) => {
  const res = await API.get("/product/recommend-fortune", {
    params: { birthYear, brandId, minPrice, maxPrice, categoryId, page, limit },
  });
  return res.data;
};
