import axiosClient from "../utils/axiosClient";

export const loginUser = async (email, password) => {
  try {
    const res = await axiosClient.post("/user/login", { email, password });
    return res.data;
  } catch (err) {
    console.error("Login API error:", err);
    throw err;
  }
};

export const registerUser = async (data) => {
  try {
    const res = await axiosClient.post("/user/create-new-user", data);
    return res.data;
  } catch (err) {
    console.error("Register API error:", err);
    throw err;
  }
};
