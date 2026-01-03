const moment = require("moment");
const qs = require("qs");
const crypto = require("crypto");
const OrderService = require("../services/OrderService");

/**
 * Sort object by key ASC
 */
function sortObject(obj) {
  const sorted = {};
  Object.keys(obj)
    .sort()
    .forEach((key) => {
      sorted[key] = obj[key];
    });
  return sorted;
}

/**
 * Build sign data đúng chuẩn VNPAY
 * - Sort key
 * - Encode value
 * - Replace %20 -> +
 */
function buildSignData(params) {
  return Object.keys(params)
    .sort()
    .map(
      (key) => `${key}=${encodeURIComponent(params[key]).replace(/%20/g, "+")}`
    )
    .join("&");
}

/**
 * =========================
 * CREATE PAYMENT URL
 * =========================
 */
const handleCreateVnpayPayment = async (req, res) => {
  try {
    const { amount, orderId } = req.body;

    if (!amount) {
      return res.status(400).json({
        errCode: 1,
        message: "Amount is required",
      });
    }

    let ipAddr =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress || "127.0.0.1";

    if (ipAddr.includes(",")) ipAddr = ipAddr.split(",")[0];
    if (ipAddr === "::1") ipAddr = "127.0.0.1";

    const tmnCode = process.env.VNP_TMN_CODE;
    const secretKey = process.env.VNP_HASH_SECRET;
    const vnpUrl = process.env.VNP_URL;
    const returnUrl = process.env.VNP_RETURN_URL;

    const createDate = moment().format("YYYYMMDDHHmmss");
    const txnRef = orderId || `ORD${Date.now()}`;
    const vnpAmount = String(Number(amount) * 100);

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
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
    };

    const sortedParams = sortObject(vnp_Params);
    const signData = buildSignData(sortedParams);

    const secureHash = crypto
      .createHmac("sha512", secretKey)
      .update(signData, "utf-8")
      .digest("hex");

    vnp_Params.vnp_SecureHashType = "SHA512";
    vnp_Params.vnp_SecureHash = secureHash;

    const paymentUrl =
      vnpUrl + "?" + qs.stringify(vnp_Params, { encode: true });

    console.log("VNPay Create SignData:", signData);
    console.log("VNPay Create Hash:", secureHash);

    return res.status(200).json({
      errCode: 0,
      message: "OK",
      data: {
        paymentUrl,
        orderId: txnRef,
      },
    });
  } catch (err) {
    console.error("VNPay Create Error:", err);
    return res.status(500).json({
      errCode: -1,
      message: "Internal server error",
    });
  }
};

/**
 * =========================
 * RETURN URL (CLIENT REDIRECT)
 * =========================
 */
const handleVnpayReturn = async (req, res) => {
  try {
    const vnp_Params = { ...req.query };
    const secureHash = vnp_Params.vnp_SecureHash;

    if (!secureHash) {
      return res.status(400).json({
        errCode: 1,
        message: "Missing secure hash",
      });
    }

    delete vnp_Params.vnp_SecureHash;
    delete vnp_Params.vnp_SecureHashType;

    const sortedParams = sortObject(vnp_Params);
    const signData = buildSignData(sortedParams);

    const generatedHash = crypto
      .createHmac("sha512", process.env.VNP_HASH_SECRET)
      .update(signData, "utf-8")
      .digest("hex");

    if (secureHash !== generatedHash) {
      return res.status(400).json({
        errCode: 1,
        message: "Invalid VNPAY signature",
      });
    }

    const orderId = vnp_Params.vnp_TxnRef;
    const rspCode = vnp_Params.vnp_ResponseCode;

    if (rspCode === "00") {
      await OrderService.updatePaymentStatus(orderId, "paid");

      return res.redirect(
        `${process.env.FRONTEND_URL}/checkout-success/${orderId}`
      );
    }

    await OrderService.updatePaymentStatus(orderId, "unpaid");

    return res.redirect(
      `${process.env.FRONTEND_URL}/checkout-failed/${orderId}`
    );
  } catch (err) {
    console.error("VNPay Return Error:", err);
    return res.status(500).json({
      errCode: -1,
      message: "Internal server error",
    });
  }
};

module.exports = {
  handleCreateVnpayPayment,
  handleVnpayReturn,
};
