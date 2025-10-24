const express = require("express");
const router = express.Router();
const OrderItemController = require("../controller/OrderItemController");

router.get("/get-order-item", OrderItemController.handleGetAllOrderItems);
router.get("/order-item/:id", OrderItemController.handleGetOrderItemById);
router.post(
  "/create-new-order-item",
  OrderItemController.handleCreateOrderItem
);
router.put("/update-order-item/:id", OrderItemController.handleUpdateOrderItem);
router.delete(
  "/delete-order-item/:id",
  OrderItemController.handleDeleteOrderItem
);

router.put(
  "/request/:id/request-return",
  OrderItemController.handleRequestReturn
);
router.put(
  "/process/:id/process-return",
  OrderItemController.handleProcessReturn
);

module.exports = router;
