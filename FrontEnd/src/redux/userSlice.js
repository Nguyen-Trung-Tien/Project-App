import { createSlice } from "@reduxjs/toolkit";

let userFromStorage = null;
let tokenFromStorage = null;

try {
  const storedUser = localStorage.getItem("user");
  const storedToken = localStorage.getItem("accessToken");
  if (storedUser && storedToken) {
    userFromStorage = JSON.parse(storedUser);
    tokenFromStorage = storedToken;
  }
} catch (e) {
  console.log(e);
  console.warn("Invalid user/token in localStorage, clearing it.");
  localStorage.removeItem("user");
  localStorage.removeItem("accessToken");
}

const initialState = {
  user: userFromStorage,
  token: tokenFromStorage,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("accessToken", action.payload.token);
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    removeUser: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
    },
  },
});

export const { setUser, removeUser, updateUser } = userSlice.actions;
export default userSlice.reducer;
