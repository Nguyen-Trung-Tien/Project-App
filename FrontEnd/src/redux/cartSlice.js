import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: JSON.parse(localStorage.getItem("cartItems")) || [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartItems: (state, action) => {
      if (!Array.isArray(action.payload)) return;
      state.cartItems = action.payload.map((item) => ({ ...item }));
    },

    appendCartItems: (state, action) => {
      if (!Array.isArray(action.payload)) return;

      const updatedItems = [...state.cartItems];

      action.payload.forEach((item) => {
        const index = updatedItems.findIndex((i) => i.id === item.id);
        if (index >= 0) {
          const existing = updatedItems[index];
          if (
            existing.quantity !== item.quantity ||
            existing.product.price !== item.product.price ||
            existing.product.discount !== item.product.discount
          ) {
            updatedItems[index] = { ...item };
          }
        } else {
          updatedItems.push(item);
        }
      });

      state.cartItems = updatedItems;
    },

    addCartItem: (state, action) => {
      const item = action.payload;
      if (!item) return;

      const minimalItem = {
        id: item.id,
        product: {
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          discount: item.product.discount || 0,
          image: item.product.image || [],
        },
        quantity: item.quantity,
      };

      const index = state.cartItems.findIndex((i) => i.id === minimalItem.id);
      if (index >= 0) {
        state.cartItems[index].quantity += minimalItem.quantity;
      } else {
        state.cartItems.push(minimalItem);
      }
    },

    updateCartItemQuantity: (state, action) => {
      const { id, quantity } = action.payload || {};
      const item = state.cartItems.find((i) => i.id === id);
      if (item && quantity > 0) {
        item.quantity = quantity;
      }
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
  appendCartItems,
  addCartItem,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
