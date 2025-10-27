const express = require("express");
const router = express.Router();
const PaymentController = require("../controller/PaymentController");

router.get("/get-all-payment", PaymentController.handleGetAllPayments);
router.get("/get-payment/:id", PaymentController.handleGetPaymentById);
router.post("/create-payment/", PaymentController.handleCreatePayment);
router.delete("/delete-payment/:id", PaymentController.handleDeletePayment);
router.put("/update-payment/:orderId", PaymentController.handleUpdatePayment);
router.put(
  "/payment-complete/:id/complete",
  PaymentController.handleCompletePayment
);
router.put("/payment-refund/:id/refund", PaymentController.handleRefundPayment);

router.post(
  "/create-vnpay-payment",
  PaymentController.handleCreateVnpayPayment
);
router.get("/vnpay-return", PaymentController.handleVnpayReturn);
module.exports = router;
