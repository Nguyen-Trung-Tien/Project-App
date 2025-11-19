import axios from "axios";
import axiosClient from "../utils/axiosClient";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getAllCategoryApi = async () => {
  const res = await API.get("/category/get-all-category");
  return res.data;
};

export const createCategoryApi = async (data, token) => {
  const res = await axiosClient.post("/category/create", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateCategoryApi = async (id, data, token) => {
  const res = await axiosClient.put(`/category/update/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteCategoryApi = async (id, token) => {
  const res = await axiosClient.delete(`/category/delete/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
