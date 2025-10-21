const express = require("express");
const router = express.Router();
const UserController = require("../controller/UserController");
const {
  authenticateToken,
  authorizeRole,
} = require("../middleware/authMiddleware");

router.post("/create-new-user", UserController.handleCreateNewUser);
router.post("/login", UserController.handleLogin);
router.put("/update-user", authenticateToken, UserController.handleUpdateUser);
router.post("/refresh-token", UserController.handleRefreshToken);
router.get("/get-all-user", UserController.handleGetAllUsers);
router.get(
  "/get-user/:id",
  authenticateToken,
  UserController.handleGetUserById
);

module.exports = router;
