import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getAllOrderItems = async () => {
  try {
    const res = await API.get("/order-item/get-order-item");
    return res.data;
  } catch (error) {
    console.error("Error getting all order items:", error);
    throw error;
  }
};

export const getOrderItemById = async (id) => {
  try {
    const res = await API.get(`/order-item/order-item/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Error getting order item with id ${id}:`, error);
    throw error;
  }
};

export const createOrderItem = async (data) => {
  try {
    const res = await API.post("/order-item/create-new-order-item", data);
    return res.data;
  } catch (error) {
    console.error("Error creating order item:", error);
    throw error;
  }
};

export const updateOrderItem = async (id, data) => {
  try {
    const res = await API.put(`/order-item/update-order-item/${id}`, data);
    return res.data;
  } catch (error) {
    console.error(`Error updating order item ${id}:`, error);
    throw error;
  }
};

export const deleteOrderItem = async (id) => {
  try {
    const res = await API.delete(`/order-item/delete-order-item/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Error deleting order item ${id}:`, error);
    throw error;
  }
};

export const requestReturn = async (id, reason) => {
  try {
    const res = await API.put(`/order-item/request/${id}/request-return`, {
      reason,
    });
    return res.data;
  } catch (error) {
    console.error(`Error requesting return for order item ${id}:`, error);
    throw error;
  }
};

export const processReturn = async (id, status) => {
  try {
    const res = await API.put(`/order-item/process/${id}/process-return`, {
      status,
    });
    return res.data;
  } catch (error) {
    console.error(`Error processing return for order item ${id}:`, error);
    throw error;
  }
};
