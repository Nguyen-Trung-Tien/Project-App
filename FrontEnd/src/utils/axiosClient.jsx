import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { updateToken, removeUser } from "../redux/userSlice";
import { store } from "../redux/store";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080/api/v1",
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
          const response = await axiosClient.post("/user/refresh-token");
          const newAccessToken = response.data.data.accessToken;

          localStorage.setItem("accessToken", newAccessToken);
          store.dispatch(updateToken(newAccessToken));

          scheduleAutoRefresh(newAccessToken);
          console.log("Token tự động được làm mới!");
        } catch (err) {
          console.error("Auto refresh thất bại:", err);
          store.dispatch(removeUser());
        }
      }, refreshTime);

      console.log(
        `Token sẽ được làm mới tự động sau ${Math.round(
          refreshTime / 1000
        )} giây.`
      );
    }
  } catch (err) {
    console.error("Không thể decode token:", err);
  }
};

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
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
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return axiosClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axiosClient.post("/user/refresh-token");
        const newAccessToken = response.data.data.accessToken;

        localStorage.setItem("accessToken", newAccessToken);
        store.dispatch(updateToken(newAccessToken));

        scheduleAutoRefresh(newAccessToken);

        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);
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

const existingToken = localStorage.getItem("accessToken");
if (existingToken) scheduleAutoRefresh(existingToken);

export default axiosClient;
