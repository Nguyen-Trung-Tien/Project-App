const express = require("express");
const router = express.Router();
const CartController = require("../controller/CartController");

router.get("/get-all-cart", CartController.getAllCarts);
router.get("/get-cart/:id", CartController.getCartById);
router.post("/create-cart", CartController.createCart);
router.put("/update-cart/:id", CartController.updateCart);
router.delete("/delete-cart/:id", CartController.deleteCart);

module.exports = router;
