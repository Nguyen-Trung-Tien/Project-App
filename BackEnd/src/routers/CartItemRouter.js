const express = require("express");
const router = express.Router();
const CartItemController = require("../controller/CartItemController");

router.get("/get-all-cartItem", CartItemController.getAllCartItems);
router.get("/get-cartItem/:id", CartItemController.getCartItemById);
router.post("/create-cartItem/", CartItemController.createCartItem);
router.put("/update-cartItem/:id", CartItemController.updateCartItem);
router.delete("/delete-cartItem/:id", CartItemController.deleteCartItem);

module.exports = router;
