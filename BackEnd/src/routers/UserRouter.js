const express = require("express");
const router = express.Router();
const UserController = require("../controller/UserController");
const {
  authenticateToken,
  authorizeRole,
} = require("../middleware/authMiddleware");

router.post("/login", UserController.handleLogin);
router.post("/create-new-user", UserController.handleCreateNewUser);

router.post("/refresh-token", UserController.handleRefreshToken);

router.get(
  "/get-all-user",
  authenticateToken,
  authorizeRole(["admin"]),
  UserController.handleGetAllUsers
);

router.get(
  "/get-user/:id",
  authenticateToken,
  UserController.handleGetUserById
);
router.put("/update-user", authenticateToken, UserController.handleUpdateUser);

router.delete(
  "/delete/:id",
  authenticateToken,
  authorizeRole(["admin"]),
  UserController.handleDeleteUser
);

router.post("/logout", UserController.handleLogout);

module.exports = router;
