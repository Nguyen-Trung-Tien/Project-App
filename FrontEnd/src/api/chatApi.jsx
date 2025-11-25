import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const sendMessage = async (message, userId = null) => {
  try {
    const payload = { message, userId };

    const res = await API.post("/chat/ask", payload);

    return res.data.reply;
  } catch (error) {
    console.error("Chatbot error:", error);

    if (error.response) {
      return `Lỗi server: ${
        error.response.data.error || "Không thể xử lý yêu cầu."
      }`;
    }

    if (error.code === "ECONNABORTED") {
      return "Máy chủ phản hồi quá lâu. Bạn thử lại giúp mình nhé!";
    }

    return "Lỗi không xác định. Vui lòng thử lại.";
  }
};
