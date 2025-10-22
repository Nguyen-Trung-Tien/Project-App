import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getAllCategoryApi = async () => {
  try {
    const res = await API.get("/category/get-all-category");
    return res.data;
  } catch (err) {
    console.error("Get Category API error:", err);
    throw err;
  }
};
