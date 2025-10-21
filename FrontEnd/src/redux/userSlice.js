import { createSlice } from "@reduxjs/toolkit";

const loadFromStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.warn(`Failed to parse localStorage item ${key}`, e);
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
    if (e.name === "QuotaExceededError") {
      console.warn("localStorage full. Clearing old data.");
      localStorage.clear();
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      console.error(`Failed to save ${key} to localStorage`, e);
    }
  }
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { user, token, refreshToken } = action.payload;

      const minimalUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar || "/default-avatar.png",
      };

      state.user = minimalUser;
      state.token = token;
      state.refreshToken = refreshToken;

      saveToStorage("user", minimalUser);
      try {
        localStorage.setItem("accessToken", token);
        localStorage.setItem("refreshToken", refreshToken);
      } catch (e) {
        if (e.name === "QuotaExceededError") {
          localStorage.clear();
          localStorage.setItem("user", JSON.stringify(minimalUser));
          localStorage.setItem("accessToken", token);
          localStorage.setItem("refreshToken", refreshToken);
        } else {
          throw e;
        }
      }
    },

    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
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
