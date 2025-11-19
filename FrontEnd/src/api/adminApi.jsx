import axiosClient from "../utils/axiosClient";

export const getDashboard = async (token) => {
  try {
    const res = await axiosClient.get("/admin/dashboard", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("Error getting dashboard:", error);
    throw error;
  }
};
