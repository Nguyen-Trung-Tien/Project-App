require("dotenv").config();
const PaymentService = require("../services/PaymentService");
const moment = require("moment");
const qs = require("qs");
const crypto = require("crypto");

const handleGetAllPayments = async (req, res) => {
  try {
    const result = await PaymentService.getAllPayments();
    return res.status(200).json(result);
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Internal server error",
    });
  }
};

const handleGetPaymentById = async (req, res) => {
  try {
    const result = await PaymentService.getPaymentById(req.params.id);
    return res.status(200).json(result);
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Internal server error",
    });
  }
};

const handleCreatePayment = async (req, res) => {
  try {
    const result = await PaymentService.createPayment(req.body);
    return res.status(201).json(result);
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Internal server error",
    });
  }
};

const handleUpdatePayment = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const result = await PaymentService.updatePayment(orderId, req.body);
    return res.status(200).json(result);
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Internal server error",
    });
  }
};

const handleDeletePayment = async (req, res) => {
  try {
    const result = await PaymentService.deletePayment(req.params.id);
    return res.status(200).json(result);
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Internal server error",
    });
  }
};

const handleCompletePayment = async (req, res) => {
  try {
    const result = await PaymentService.completePayment(
      req.params.id,
      req.body.transactionId
    );
    return res.status(200).json(result);
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Internal server error",
    });
  }
};

const handleRefundPayment = async (req, res) => {
  try {
    const result = await PaymentService.refundPayment(
      req.params.id,
      req.body.note
    );
    return res.status(200).json(result);
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Internal server error",
    });
  }
};

function sortObject(obj) {
  const sorted = {};
  const keys = Object.keys(obj).sort();
  for (let key of keys) {
    sorted[key] = obj[key];
  }
  return sorted;
}

const handleCreateVnpayPayment = async (req, res) => {
  try {
    const { amount, orderId } = req.body;
    const ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress;
    const ip = ipAddr === "::1" ? "127.0.0.1" : ipAddr;
    const tmnCode = process.env.VNP_TMN_CODE;
    const secretKey = process.env.VNP_HASH_SECRET;
    const vnpUrl = process.env.VNP_URL;
    const returnUrl = process.env.VNP_RETURN_URL;
    const createDate = moment().format("YYYYMMDDHHmmss");
    const txnRef = orderId || `ORD${Date.now()}`;
    const vnpAmount = Number(amount) * 100;
    let vnp_Params = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: tmnCode,
      vnp_Locale: "vn",
      vnp_CurrCode: "VND",
      vnp_TxnRef: txnRef,
      vnp_OrderInfo: `Thanh toan don hang ${txnRef}`,
      vnp_OrderType: "billpayment",
      vnp_Amount: vnpAmount,
      vnp_ReturnUrl: `${returnUrl}?orderId=${txnRef}`,
      vnp_IpAddr: ip,
      vnp_CreateDate: createDate,
    };

    let sortedParams = sortObject(vnp_Params);
    const signData = qs.stringify(sortedParams, { encode: false });
    const secureHash = crypto
      .createHmac("sha512", secretKey)
      .update(Buffer.from(signData, "utf-8"))
      .digest("hex");
    vnp_Params["vnp_SecureHash"] = secureHash;
    const query = qs
      .stringify(vnp_Params, { encode: true })
      .replace(/%20/g, "+");
    const paymentUrl = `${vnpUrl}?${query}`;
    return res.status(200).json({
      errCode: 0,
      errMessage: "OK",
      data: { paymentUrl },
    });
  } catch (err) {
    console.error("Error creating VNPay payment:", err);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Internal server error",
    });
  }
};

const handleVnpayReturn = async (req, res) => {
  try {
    const vnp_Params = req.query;
    const secureHash = vnp_Params["vnp_SecureHash"];
    if (!secureHash) {
      return res.status(400).json({
        errCode: 1,
        message: "Missing VNPAY secure hash",
      });
    }
    const vnp_Params_To_Check = {};
    for (let key in vnp_Params) {
      if (
        vnp_Params.hasOwnProperty(key) &&
        key.startsWith("vnp_") &&
        key !== "vnp_SecureHash" &&
        key !== "vnp_SecureHashType"
      ) {
        vnp_Params_To_Check[key] = vnp_Params[key];
      }
    }

    const sortedParams = sortObject(vnp_Params_To_Check);
    const signData = qs.stringify(sortedParams, { encode: false });

    const secretKey = process.env.VNP_HASH_SECRET;
    const generatedHash = crypto
      .createHmac("sha512", secretKey)
      .update(Buffer.from(signData, "utf-8"))
      .digest("hex");
    if (secureHash !== generatedHash) {
      console.warn("Invalid VNPAY signature", {
        receivedHash: secureHash,
        generatedHash,
      });
      return res.status(400).json({
        errCode: 1,
        message: "Invalid VNPAY signature",
      });
    }
    const orderId = vnp_Params["vnp_TxnRef"];
    const rspCode = vnp_Params["vnp_ResponseCode"];
    const transactionId = vnp_Params["vnp_TransactionNo"];

    if (!orderId || !rspCode) {
      return res.status(400).json({
        errCode: 1,
        message: "Missing required VNPay parameters",
      });
    }

    const messages = {
      "00": "Giao dịch thành công",
      "07": "Giao dịch bị nghi ngờ gian lận",
      "09": "Thẻ/tài khoản chưa đăng ký dịch vụ",
      24: "Khách hàng hủy giao dịch",
    };
    const message = messages[rspCode] || "Giao dịch thất bại";

    if (rspCode === "00") {
      await PaymentService.updatePayment(orderId, {
        status: "completed",
        transactionId,
      });
      return res.redirect(
        `${process.env.FRONTEND_URL}/checkout-success/${orderId}`
      );
    } else {
      await PaymentService.updatePayment(orderId, {
        status: "failed",
        message,
      });
      return res.redirect(
        `${
          process.env.FRONTEND_URL
        }/checkout-failed/${orderId}?message=${encodeURIComponent(message)}`
      );
    }
  } catch (err) {
    console.error("Error handling VNPAY return:", err);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Internal server error",
    });
  }
};

module.exports = {
  handleGetAllPayments,
  handleGetPaymentById,
  handleCreatePayment,
  handleUpdatePayment,
  handleDeletePayment,
  handleCompletePayment,
  handleRefundPayment,
  handleCreateVnpayPayment,
  handleVnpayReturn,
};
