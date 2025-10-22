const express = require("express");
const router = express.Router();
const ReviewController = require("../controller/ReviewController");

router.get("/product/:productId", ReviewController.handleGetReviewsByProduct);
router.post("/create", ReviewController.handleCreateReview);

module.exports = router;
