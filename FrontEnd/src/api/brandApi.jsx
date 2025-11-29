import axios from "axios";
import axiosClient from "../utils/axiosClient";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getAllBrandApi = async () => {
  try {
    const res = await API.get(`/brand/get-all-brand`);
    return res.data;
  } catch (err) {
    console.error("Get All Brand API error:", err);
    throw err;
  }
};

export const getBrandByIdApi = async (id) => {
  try {
    const res = await API.get(`/brand/get-brand/${id}`);
    return res.data;
  } catch (err) {
    console.error("Get Brand by ID API error:", err);
    throw err;
  }
};

export const createBrandApi = async (data, token) => {
  try {
    const res = await axiosClient.post(`/brand/create-new-brand`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (err) {
    console.error("Create Brand API error:", err);
    throw err;
  }
};

export const updateBrandApi = async (id, data, token) => {
  try {
    const res = await axiosClient.put(`/brand/update-brand/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (err) {
    console.error("Update Brand API error:", err);
    throw err;
  }
};

export const deleteBrandApi = async (id, token) => {
  try {
    const res = await axiosClient.delete(`/brand/delete-brand/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (err) {
    console.error("Delete Brand API error:", err);
    throw err;
  }
};
