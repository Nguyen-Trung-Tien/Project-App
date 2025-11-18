import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getAllPayments = async ({
  page = 1,
  limit = 10,
  status = "all",
  search = "",
}) => {
  try {
    const params = new URLSearchParams({
      page,
      limit,
      ...(status !== "all" && { status }),
      ...(search && { search }),
    });

    const res = await API.get(`/payment/get-all-payment?${params}`);
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

export const completePayment = async (id, transactionId) => {
  try {
    const res = await API.put(`/payment/payment-complete/${id}/complete`, {
      transactionId,
    });
    return res.data;
  } catch (error) {
    console.error("Error completing payment:", error);
    throw error;
  }
};

export const refundPayment = async (id, note) => {
  try {
    const res = await API.put(`/payment/payment-refund/${id}/refund`, { note });
    return res.data;
  } catch (error) {
    console.error("Error refunding payment:", error);
    throw error;
  }
};

export const createVnpayPayment = async (data) => {
  try {
    const res = await API.post("/vnpay/create-vnpay-payment", data);
    const { errCode, errMessage, data: resData } = res.data;

    if (errCode === 0 && resData?.paymentUrl) {
      return resData.paymentUrl;
    } else {
      throw new Error(errMessage || "Tạo liên kết thanh toán thất bại");
    }
  } catch (error) {
    console.error("Error creating VNPAY payment:", error);
    throw error;
  }
};
