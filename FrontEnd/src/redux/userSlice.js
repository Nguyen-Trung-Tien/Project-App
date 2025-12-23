import { createSlice } from "@reduxjs/toolkit";

const loadFromStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.log(e);
    localStorage.removeItem(key);
    return null;
  }
};

const initialState = {
  user: loadFromStorage("user"),
  token: localStorage.getItem("accessToken") || null,
  refreshToken: localStorage.getItem("refreshToken") || null,
};

const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    if (e.name === "QuotaExceededError" || e.code === 22) {
      console.warn("LocalStorage đầy — đang dọn dẹp dữ liệu cũ...");
      try {
        const preserved = ["user", "accessToken"];
        Object.keys(localStorage).forEach((k) => {
          if (!preserved.includes(k)) localStorage.removeItem(k);
        });

        localStorage.setItem(key, JSON.stringify(value));
      } catch (err) {
        console.error("Không thể lưu sau khi dọn dẹp:", err);
      }
    } else {
      console.error(`Lỗi khi lưu ${key}:`, e);
    }
  }
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { user, token, refreshToken } = action.payload;

      state.user = {
        ...user,
        avatar: user.avatar || "/default-avatar.png",
      };
      state.token = token || null;
      state.refreshToken = refreshToken || null;

      saveToStorage("user", state.user);

      if (token) localStorage.setItem("accessToken", token);
      else localStorage.removeItem("accessToken");

      if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
      else localStorage.removeItem("refreshToken");
    },

    updateUser: (state, action) => {
      const safeAvatar =
        action.payload.avatar && typeof action.payload.avatar === "string"
          ? action.payload.avatar
          : state.user?.avatar || "/default-avatar.png";

      state.user = { ...state.user, ...action.payload, avatar: safeAvatar };

      saveToStorage("user", state.user);
    },

    updateToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem("accessToken", action.payload);
    },

    updateRefreshToken: (state, action) => {
      state.refreshToken = action.payload;
      localStorage.setItem("refreshToken", action.payload);
    },

    removeUser: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
  },
});

export const {
  setUser,
  removeUser,
  updateUser,
  updateToken,
  updateRefreshToken,
} = userSlice.actions;
export default userSlice.reducer;
