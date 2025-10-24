const express = require("express");
const router = express.Router();
const OrderController = require("../controller/OrderController");

router.get("/get-all-orders", OrderController.handleGetAllOrders);
router.get("/get-order/:id", OrderController.handleGetOrderById);
router.post("/create-new-order", OrderController.handleCreateOrder);
router.put(
  "/update-status-order/:id/status",
  OrderController.handleUpdateOrderStatus
);
router.delete("/delete-order/:id", OrderController.handleDeleteOrder);

module.exports = router;
