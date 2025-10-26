import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getAllOrders = async (page = 1, limit = 10) => {
  try {
    const res = await API.get("/order/get-all-orders", {
      params: { page, limit },
    });
    return res.data;
  } catch (error) {
    console.error("Error getting all orders:", error);
    throw error;
  }
};

export const getOrderById = async (orderId) => {
  try {
    const res = await API.get(`/order/get-order/${orderId}`);
    return res.data;
  } catch (error) {
    console.error("Error getting order by id:", error);
    throw error;
  }
};

export const createOrder = async (data) => {
  try {
    const res = await API.post("/order/create-new-order", data);
    return res.data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const res = await API.put(`/order/update-status-order/${orderId}/status`, {
      status,
    });
    return res.data;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

export const updatePaymentStatus = async (orderId, paymentStatus) => {
  try {
    const res = await API.put(`/order/update-payment-status/${orderId}`, {
      paymentStatus,
    });
    return res.data;
  } catch (error) {
    console.error("Error updating payment status:", error);
    throw error;
  }
};

export const deleteOrder = async (orderId) => {
  try {
    const res = await API.delete(`/order/delete-order/${orderId}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting order:", error);
    throw error;
  }
};
