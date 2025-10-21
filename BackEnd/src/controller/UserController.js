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
    return res.status(200).json(result);
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ errCode: -1, errMessage: "Internal server error" });
  }
};

const handleRefreshToken = (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res
        .status(400)
        .json({ errCode: 1, errMessage: "Refresh token is required" });
    }

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      return res
        .status(403)
        .json({ errCode: 2, errMessage: "Invalid or expired refresh token" });
    }

    // Tạo access token mới
    const accessToken = generateAccessToken({
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    });

    return res.status(200).json({
      errCode: 0,
      errMessage: "Access token refreshed successfully",
      accessToken,
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ errCode: -1, errMessage: "Internal server error" });
  }
};

module.exports = { handleCreateNewUser, handleLogin, handleRefreshToken };
