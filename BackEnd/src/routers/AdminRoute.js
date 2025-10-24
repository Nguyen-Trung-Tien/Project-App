const express = require("express");
const router = express.Router();
const AdminController = require("../controller/AdminController");

router.get("/dashboard", AdminController.getDashboard);

module.exports = router;
