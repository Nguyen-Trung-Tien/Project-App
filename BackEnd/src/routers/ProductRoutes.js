const express = require("express");
const router = express.Router();
const ProductController = require("../controller/ProductController");

router.post("/create-new-product", ProductController.handleCreateProduct);
router.get("/get-all-product", ProductController.handleGetAllProducts);
router.get("/get-product/:id", ProductController.handleGetProductById);
router.put("/update-product/:id", ProductController.handleUpdateProduct);
router.delete("/delete-product/:id", ProductController.handleDeleteProduct);
router.get("/product-by-category", ProductController.getProductsByCategory);
module.exports = router;
