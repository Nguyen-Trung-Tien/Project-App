import axios from "axios";

const API_URL = "http://localhost:8080/api/v1/chat/ask";

export const sendMessage = async (message) => {
  const res = await axios.post(API_URL, { message });
  return res.data.reply;
};
