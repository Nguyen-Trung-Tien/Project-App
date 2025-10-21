const UserService = require("../services/userService");

const handleCreateNewUser = async (req, res) => {
  try {
    const message = await UserService.createNewUser(req.body);
    return res.status(200).json(message);
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ errCode: -1, errMessage: "Internal server error" });
  }
};

const handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ errCode: 3, errMessage: "Email and password are required!" });
    }

    const result = await UserService.handleUserLogin(email, password);

    if (result.errCode !== 0) {
      return res.status(401).json(result);
    }

    res.cookie("refreshToken", result.data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      errCode: 0,
      errMessage: "Login successful",
      data: {
        user: result.data.user,
        accessToken: result.data.accessToken,
      },
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ errCode: -1, errMessage: "Internal server error" });
  }
};

const handleRefreshToken = (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res
        .status(400)
        .json({ errCode: 1, errMessage: "Refresh token is required" });
    }

    const decoded = UserService.verifyRefreshToken(refreshToken);
    if (!decoded) {
      return res
        .status(403)
        .json({ errCode: 2, errMessage: "Invalid or expired refresh token" });
    }

    const accessToken = UserService.generateAccessToken({
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    });

    return res.status(200).json({
      errCode: 0,
      errMessage: "Access token refreshed successfully",
      data: { accessToken },
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ errCode: -1, errMessage: "Internal server error" });
  }
};

const handleUpdateUser = async (req, res) => {
  try {
    const userId = req.body.id;
    if (!userId) {
      return res
        .status(400)
        .json({ errCode: 1, errMessage: "User ID is required" });
    }

    const data = req.body;

    const result = await UserService.updateUser(userId, data);

    if (result.errCode !== 0) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ errCode: -1, errMessage: "Internal server error" });
  }
};

const handleGetAllUsers = async (req, res) => {
  try {
    const result = await UserService.getAllUsers();
    return res.status(200).json(result);
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ errCode: -1, errMessage: "Internal server error" });
  }
};

const handleGetUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res
        .status(400)
        .json({ errCode: 1, errMessage: "User ID is required" });
    }

    const result = await UserService.getUserById(userId);

    if (result.errCode !== 0) {
      return res.status(404).json(result);
    }

    return res.status(200).json(result);
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ errCode: -1, errMessage: "Internal server error" });
  }
};
module.exports = {
  handleCreateNewUser,
  handleLogin,
  handleRefreshToken,
  handleUpdateUser,
  handleGetAllUsers,
  handleGetUserById,
};
