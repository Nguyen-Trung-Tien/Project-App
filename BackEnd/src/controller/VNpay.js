const moment = require("moment");
const crypto = require("crypto");
const OrderService = require("../services/OrderService");

/**
 * =========================
 * SORT OBJECT BY KEY (ASC)
 * =========================
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
 * =========================
 * BUILD SIGN DATA (VNPay)
 * - sort key
 * - encodeURIComponent
 * - replace %20 -> +
 * =========================
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
 * =================================================
 * CREATE VNPAY PAYMENT URL
 * =================================================
 */
const handleCreateVnpayPayment = async (req, res) => {
  try {
    const { amount, orderCode } = req.body;

    if (!amount || !orderCode) {
      return res.status(400).json({
        errCode: 1,
        message: "amount & orderCode are required",
      });
    }

    // 🔎 check order tồn tại
    const orderResult = await OrderService.getOrderByCode(orderCode);
    if (orderResult.errCode !== 0) {
      return res.status(404).json({
        errCode: 2,
        message: "Order not found",
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

    // ❗ VNPay yêu cầu INTEGER
    const vnpAmount = Math.round(Number(amount) * 100);

    let vnp_Params = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: tmnCode,
      vnp_Locale: "vn",
      vnp_CurrCode: "VND",
      vnp_TxnRef: orderCode,
      vnp_OrderInfo: `Thanh toan don hang ${orderCode}`,
      vnp_OrderType: "billpayment",
      vnp_Amount: vnpAmount,
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
    };

    // 🔐 SIGN
    const sortedParams = sortObject(vnp_Params);
    const signData = buildSignData(sortedParams);

    const secureHash = crypto
      .createHmac("sha512", secretKey)
      .update(signData, "utf-8")
      .digest("hex");

    vnp_Params.vnp_SecureHashType = "SHA512";
    vnp_Params.vnp_SecureHash = secureHash;

    // ❗ TUYỆT ĐỐI KHÔNG dùng qs.stringify
    const paymentUrl = `${vnpUrl}?${buildSignData(vnp_Params)}`;

    return res.status(200).json({
      errCode: 0,
      message: "OK",
      data: {
        paymentUrl,
        orderCode,
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
 * =================================================
 * VNPAY RETURN URL
 * =================================================
 */
const handleVnpayReturn = async (req, res) => {
  try {
    let vnp_Params = { ...req.query };
    const secureHash = vnp_Params.vnp_SecureHash;

    if (!secureHash) {
      return res.status(400).json({
        errCode: 1,
        message: "Missing secure hash",
      });
    }

    // ❌ XÓA HASH TRƯỚC KHI VERIFY
    delete vnp_Params.vnp_SecureHash;
    delete vnp_Params.vnp_SecureHashType;

    // ✅ SORT + BUILD SIGN DATA
    const sortedParams = sortObject(vnp_Params);
    const signData = buildSignData(sortedParams);

    const generatedHash = crypto
      .createHmac("sha512", process.env.VNP_HASH_SECRET)
      .update(signData, "utf-8")
      .digest("hex");

    // ❌ SAI CHỮ KÝ
    if (secureHash !== generatedHash) {
      console.log("SIGN DATA:", signData);
      console.log("HASH FROM VNPAY:", secureHash);
      console.log("HASH GENERATED:", generatedHash);

      return res.status(400).json({
        errCode: 2,
        message: "Invalid VNPay signature",
      });
    }

    // ✅ LẤY THÔNG TIN
    const orderCode = vnp_Params.vnp_TxnRef;
    const rspCode = vnp_Params.vnp_ResponseCode;

    // 🔎 TÌM ORDER THEO orderCode
    const orderResult = await OrderService.getOrderByCode(orderCode);
    if (orderResult.errCode !== 0 || !orderResult.data) {
      return res.status(404).json({
        errCode: 3,
        message: "Order not found",
      });
    }

    const order = orderResult.data;

    // ✅ THANH TOÁN THÀNH CÔNG
    if (rspCode === "00") {
      await OrderService.updatePaymentStatus(order.id, "paid");

      return res.redirect(
        `${process.env.FRONTEND_URL}/checkout-success/${orderCode}`
      );
    }

    // ❌ THANH TOÁN THẤT BẠI
    await OrderService.updatePaymentStatus(order.id, "unpaid");

    return res.redirect(
      `${process.env.FRONTEND_URL}/checkout-failed/${orderCode}`
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
