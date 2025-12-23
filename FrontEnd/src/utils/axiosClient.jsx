import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { updateToken, removeUser } from "../redux/userSlice";
import { store } from "../redux/store";
import { toast } from "react-toastify";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];
let refreshTimeout = null;

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

const scheduleAutoRefresh = (token) => {
  try {
    const decoded = jwtDecode(token);
    const expiresAt = decoded.exp * 1000;
    const now = Date.now();
    const refreshTime = expiresAt - now - 60000;

    if (refreshTime > 0) {
      clearTimeout(refreshTimeout);
      refreshTimeout = setTimeout(async () => {
        try {
          const res = await axiosClient.post("/user/refresh-token");
          const newToken = res.data.data.accessToken;

          localStorage.setItem("accessToken", newToken);
          store.dispatch(updateToken(newToken));
          scheduleAutoRefresh(newToken);

          console.log("Token auto refreshed");
        } catch (err) {
          console.log(err);
          toast.warning("Vui lòng đăng nhập lại!");
          store.dispatch(removeUser());
        }
      }, refreshTime);
    }
  } catch (err) {
    console.error("Decode token failed", err);
  }
};

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    config.headers["Cache-Control"] = "no-cache";
    config.headers["Pragma"] = "no-cache";
    config.headers["If-None-Match"] = "";

    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await axiosClient.post("/user/refresh-token");
        const newToken = res.data.data.accessToken;

        localStorage.setItem("accessToken", newToken);
        store.dispatch(updateToken(newToken));
        scheduleAutoRefresh(newToken);

        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosClient(originalRequest);
      } catch (err) {
        processQueue(err, null);
        store.dispatch(removeUser());
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

/* ================= INIT ================= */
const existingToken = localStorage.getItem("accessToken");
if (existingToken) scheduleAutoRefresh(existingToken);

export default axiosClient;
