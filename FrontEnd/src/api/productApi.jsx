import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getAllProductApi = async () => {
  try {
    const res = await API.get("/product/get-all-product");
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

export const createProductApi = async (data) => {
  try {
    const res = await API.post(`/product/create-new-product`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    console.error("Create product API error:", err);
    throw err;
  }
};

export const updateProductApi = async (id, data) => {
  try {
    const res = await API.put(`s/product/update-product/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    console.error("Update product API error:", err);
    throw err;
  }
};

export const deleteProductApi = async (id) => {
  try {
    const res = await API.delete(`/product/delete-product/${id}`);
    return res.data;
  } catch (err) {
    console.error("Delete product API error:", err);
    throw err;
  }
};

export const getProductsByCategoryApi = async (categoryId) => {
  try {
    const res = await API.get(
      `/product/product-by-category?categoryId=${categoryId}`
    );
    return res.data;
  } catch (error) {
    console.error(`Error getting products by category ${categoryId}:`, error);
    throw error;
  }
};
