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

const handleCreateVnpayPayment = async (req, res) => {
  const { amount, orderId } = req.body;
  const ipAddr =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress;

  const tmnCode = process.env.VNP_TMN_CODE;
  const secretKey = process.env.VNP_HASH_SECRET;
  const vnpUrl = process.env.VNP_URL;
  const returnUrl = process.env.VNP_RETURN_URL;
  const createDate = moment().format("YYYYMMDDHHmmss");
  const txnRef = orderId || `ORD${Date.now()}`;

  let vnp_Params = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: tmnCode,
    vnp_Locale: "vn",
    vnp_CurrCode: "VND",
    vnp_TxnRef: txnRef,
    vnp_OrderInfo: `Thanh toan don hang ${txnRef}`,
    vnp_OrderType: "billpayment",
    vnp_Amount: Math.round(Number(amount) * 100),
    vnp_ReturnUrl: encodeURIComponent(`${returnUrl}?orderId=${txnRef}`), // ✅ encode
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate,
  };

  vnp_Params = sortObject(vnp_Params);

  const signData = qs.stringify(vnp_Params, { encode: false });
  const signed = crypto
    .createHmac("sha512", secretKey)
    .update(Buffer.from(signData, "utf-8"))
    .digest("hex");

  vnp_Params["vnp_SecureHash"] = signed;

  const query = qs.stringify(vnp_Params, { encode: false });
  const paymentUrl = `${vnpUrl}?${query}`;

  console.log("🔹 signData:", signData);
  console.log("🔹 signed:", signed);
  console.log("🔹 paymentUrl:", paymentUrl);

  return res.status(200).json({
    errCode: 0,
    errMessage: "OK",
    data: { paymentUrl },
  });
};

const handleVnpayReturn = async (req, res) => {
  try {
    let vnp_Params = req.query;
    const secureHash = vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    vnp_Params = sortObject(vnp_Params);

    const secretKey = process.env.VNP_HASH_SECRET;
    const signData = qs.stringify(vnp_Params, { encode: true });
    const signed = crypto
      .createHmac("sha512", secretKey)
      .update(Buffer.from(signData, "utf-8"))
      .digest("hex");

    const orderId = vnp_Params["vnp_TxnRef"];
    const rspCode = vnp_Params["vnp_ResponseCode"];

    if (secureHash === signed) {
      if (rspCode === "00") {
        await PaymentService.updatePayment(orderId, {
          status: "completed",
          transactionId: vnp_Params["vnp_TransactionNo"],
        });
        return res.redirect(
          `${process.env.FRONTEND_URL}/checkout-success/${orderId}`
        );
      } else {
        await PaymentService.updatePayment(orderId, { status: "failed" });
        return res.redirect(
          `${process.env.FRONTEND_URL}/checkout-failed/${orderId}`
        );
      }
    } else {
      return res.status(400).json({
        errCode: 1,
        message: "Invalid VNPAY signature",
      });
    }
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
  for (let key of keys) sorted[key] = obj[key];
  return sorted;
}
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
