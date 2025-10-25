import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getAllCategoryApi = async () => {
  const res = await API.get("/category/get-all-category");
  return res.data;
};

export const createCategoryApi = async (data) => {
  const res = await API.post("/category/create", data);
  return res.data;
};

export const updateCategoryApi = async (id, data) => {
  const res = await API.put(`/category/update/${id}`, data);
  return res.data;
};

export const deleteCategoryApi = async (id) => {
  const res = await API.delete(`/category/delete/${id}`);
  return res.data;
};
