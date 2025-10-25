import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getAllPayments = async () => {
  try {
    const res = await API.get("/payment/get-all-payment");
    return res.data;
  } catch (error) {
    console.error("Error getting all payments:", error);
    throw error;
  }
};

export const getPaymentById = async (id) => {
  try {
    const res = await API.get(`/payment/get-payment/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error getting payment by id:", error);
    throw error;
  }
};

export const createPayment = async (data) => {
  try {
    const res = await API.post("/payment/create-payment", data);
    return res.data;
  } catch (error) {
    console.error("Error creating payment:", error);
    throw error;
  }
};

export const updatePayment = async (orderId, data) => {
  try {
    const res = await API.put(`/payment/update-payment/${orderId}`, data);
    return res.data;
  } catch (error) {
    console.error("Error updating payment:", error);
    throw error;
  }
};

export const deletePayment = async (id) => {
  try {
    const res = await API.delete(`/payment/delete-payment/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting payment:", error);
    throw error;
  }
};

export const completePayment = async (id) => {
  try {
    const res = await API.put(`/payment/payment-complete/${id}/complete`);
    return res.data;
  } catch (error) {
    console.error("Error completing payment:", error);
    throw error;
  }
};

export const refundPayment = async (id) => {
  try {
    const res = await API.put(`/payment/payment-refund/${id}/refund`);
    return res.data;
  } catch (error) {
    console.error("Error refunding payment:", error);
    throw error;
  }
};
