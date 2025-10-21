const { verifyAccessToken } = require("../services/jwtService");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return res
      .status(401)
      .json({ errCode: 1, errMessage: "No token provided" });

  const decoded = verifyAccessToken(token);
  if (!decoded)
    return res
      .status(403)
      .json({ errCode: 2, errMessage: "Invalid or expired token" });

  req.user = decoded;
  next();
};

const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        errCode: 3,
        errMessage: "You are not allowed to access this resource",
      });
    }
    next();
  };
};

module.exports = { authenticateToken, authorizeRole };
