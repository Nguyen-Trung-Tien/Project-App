import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getDashboard = async () => {
  try {
    const res = await API.get("/admin/dashboard");
    return res.data;
  } catch (error) {
    console.error("Error getting dashboard:", error);
    throw error;
  }
};
