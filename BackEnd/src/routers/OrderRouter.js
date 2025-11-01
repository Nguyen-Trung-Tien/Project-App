const express = require("express");
const router = express.Router();
const OrderController = require("../controller/OrderController");
const { authenticateToken } = require("../middleware/authMiddleware");

router.get("/get-all-orders", OrderController.handleGetAllOrders);
router.get("/get-order/:id", OrderController.handleGetOrderById);
router.get(
  "/user/:userId",
  authenticateToken,
  OrderController.handleGetOrdersByUserId
);
router.post("/create-new-order", OrderController.handleCreateOrder);
router.put(
  "/update-status-order/:id/status",
  OrderController.handleUpdateOrderStatus
);
router.delete("/delete-order/:id", OrderController.handleDeleteOrder);
router.put(
  "/update-payment-status/:id",
  OrderController.handleUpdatePaymentStatus
);
module.exports = router;
