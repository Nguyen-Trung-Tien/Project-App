import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});
export const sendMessage = async (message) => {
  const res = await API.post("/chat/ask", { message });
  return res.data.reply;
};
