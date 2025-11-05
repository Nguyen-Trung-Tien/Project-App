import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "products",
  initialState: {
    items: {},
  },
  reducers: {
    setProduct: (state, action) => {
      state.items[action.payload.id] = action.payload;
    },
    setProducts: (state, action) => {
      action.payload.forEach((p) => {
        state.items[p.id] = p;
      });
    },
  },
});

export const { setProduct, setProducts } = productSlice.actions;
export default productSlice.reducer;
