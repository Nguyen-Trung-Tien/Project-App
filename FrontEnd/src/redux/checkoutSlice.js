import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  formData: {
    username: "",
    phone: "",
    address: "",
    email: "",
    paymentMethod: "COD",
  },
  selectedIds: [],
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setFormData: (state, action) => {
      state.formData = action.payload;
    },
    setSelectedIds: (state, action) => {
      state.selectedIds = action.payload;
    },
    resetCheckout: () => initialState,
  },
});

export const { setFormData, setSelectedIds, resetCheckout } =
  checkoutSlice.actions;
export default checkoutSlice.reducer;
