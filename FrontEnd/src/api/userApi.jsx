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

export const getUserApi = async (userId, token) => {
  try {
    const res = await axiosClient.get(`/user/get-user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (err) {
    console.error("Get User API error:", err);
  }
};

export const updateUserApi = async (data, token) => {
  try {
    const res = await axiosClient.put(`/user/update-user`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (err) {
    console.error("Update User API error:", err);
    throw err;
  }
};

export const getAllUsersApi = async (token, page = 1, limit = 10) => {
  try {
    const res = await axiosClient.get(
      `/user/get-all-user?page=${page}&limit=${limit}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  } catch (err) {
    console.error("Get All Users API error:", err);
    throw err;
  }
};

export const deleteUserApi = async (userId, token) => {
  try {
    const res = await axiosClient.delete(`/user/delete/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (err) {
    console.error("Delete User API error:", err);
    throw err;
  }
};

export const logoutUserApi = async () => {
  try {
    const res = await axiosClient.post(`/user/logout`, null, {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    console.error("Delete User API error:", err);
    throw err;
  }
};

export const updatePasswordApi = async (data, token) => {
  try {
    const res = await axiosClient.put(`/user/change-password`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (err) {
    console.error("Update Password API error:", err);
    throw err;
  }
};

export const forgotPasswordApi = async (email) => {
  try {
    const res = await axiosClient.post("/user/forgot-password", { email });
    return res.data;
  } catch (err) {
    console.error("Forgot Password API error:", err);
    throw err;
  }
};

export const verifyResetTokenApi = async (email, token) => {
  try {
    const res = await axiosClient.post("/user/verify-reset-token", {
      email,
      token,
    });
    return res.data;
  } catch (err) {
    console.error("Verify Reset Token API error:", err);
    throw err;
  }
};

export const resetPasswordApi = async (email, token, newPassword) => {
  try {
    const res = await axiosClient.post("/user/reset-password", {
      email,
      token,
      newPassword,
    });
    return res.data;
  } catch (err) {
    console.error("Reset Password API error:", err);
    throw err;
  }
};
