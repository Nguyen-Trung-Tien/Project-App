import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartItems: (state, action) => {
      state.cartItems = action.payload;
    },
    addCartItem: (state, action) => {
      const item = action.payload;
      const index = state.cartItems.findIndex((i) => i.id === item.id);
      if (index >= 0) {
        state.cartItems[index].quantity += item.quantity;
      } else {
        state.cartItems.push(item);
      }
    },
    updateCartItemQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const index = state.cartItems.findIndex((i) => i.id === id);
      if (index >= 0) state.cartItems[index].quantity = quantity;
    },
    removeCartItem: (state, action) => {
      state.cartItems = state.cartItems.filter((i) => i.id !== action.payload);
    },
    clearCart: (state) => {
      state.cartItems = [];
    },
  },
});

export const {
  setCartItems,
  addCartItem,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
