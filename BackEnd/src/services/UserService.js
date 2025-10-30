const db = require("../models");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../services/jwtService");
const sendEmail = require("./sendEmail");

const hashUserPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const checkUserEmail = async (email) => {
  const user = await db.User.findOne({ where: { email } });
  return !!user;
};

const createNewUser = async (data) => {
  try {
    const emailExists = await checkUserEmail(data.email);
    if (emailExists) {
      return {
        errCode: 1,
        errMessage: "Email already exists, please use another email.",
      };
    }

    const hashedPassword = await hashUserPassword(data.password);

    await db.User.create({
      username: data.username,
      email: data.email,
      password: hashedPassword,
      phone: data.phone || null,
      address: data.address || null,
      role: data.role || "customer",
      avatar: data.avatar || null,
      isActive: true,
    });
    return { errCode: 0, errMessage: "User created successfully!" };
  } catch (error) {
    return {
      errCode: 2,
      errMessage: "Error from server",
    };
  }
};

const handleUserLogin = async (email, password) => {
  try {
    const user = await db.User.findOne({
      where: { email },
    });
    if (!user) {
      return { errCode: 1, errMessage: "User not found!" };
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { errCode: 2, errMessage: "Wrong password!" };
    }
    const payload = { id: user.id, email: user.email, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    const { password: _, ...userData } = user.toJSON();
    return {
      errCode: 0,
      errMessage: "OK",
      data: { user: userData, accessToken, refreshToken },
    };
  } catch (error) {
    return {
      errCode: 2,
      errMessage: "Error from server",
    };
  }
};

const updateUser = async (userId, data) => {
  try {
    const user = await db.User.findByPk(userId);
    if (!user) return { errCode: 1, errMessage: "User not found" };

    const fields = ["username", "email", "phone", "address", "role"];
    fields.forEach((field) => {
      if (data[field] !== undefined) user[field] = data[field];
    });
    if (data.avatar) {
      const base64Data = data.avatar.split(",")[1];
      user.avatar = Buffer.from(base64Data, "base64");
    }
    await user.save();
    const { password, ...userData } = user.toJSON();
    return { errCode: 0, errMessage: "User updated", data: userData };
  } catch (err) {
    console.error(err);
    return { errCode: 2, errMessage: "Error from server" };
  }
};

const getUserById = async (userId) => {
  try {
    const user = await db.User.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });
    if (!user) return { errCode: 1, errMessage: "User not found" };
    const userData = user.toJSON();
    userData.avatar = userData.avatar
      ? `data:image/png;base64,${userData.avatar.toString("base64")}`
      : null;

    return { errCode: 0, errMessage: "OK", data: userData };
  } catch (e) {
    console.error(e);
    return { errCode: 2, errMessage: "Server error" };
  }
};

const getAllUsers = async (page = 1, limit = 10) => {
  try {
    const offset = (page - 1) * limit;

    const { rows: users, count: totalUsers } = await db.User.findAndCountAll({
      attributes: { exclude: ["password"] },
      offset,
      limit,
      order: [["createdAt", "DESC"]],
    });

    const data = users.map((user) => {
      const u = user.toJSON();
      u.avatar = u.avatar
        ? `data:image/png;base64,${u.avatar.toString("base64")}`
        : null;
      return u;
    });

    const totalPages = Math.ceil(totalUsers / limit);

    return {
      errCode: 0,
      errMessage: "OK",
      pagination: {
        currentPage: page,
        totalPages,
        totalUsers,
        limit,
      },
      data,
    };
  } catch (e) {
    console.error(e);
    throw e;
  }
};

const deleteUser = async (userId) => {
  try {
    const user = await db.User.findByPk(userId);
    if (!user) {
      return { errCode: 1, errMessage: "User not found" };
    }
    await user.destroy();
    return { errCode: 0, errMessage: "User deleted successfully" };
  } catch (e) {
    console.error("Error deleting user:", e);
    throw e;
  }
};

const updateUserPassword = async (userId, oldPassword, newPassword) => {
  try {
    const user = await db.User.findByPk(userId);
    if (!user) {
      return { errCode: 1, errMessage: "User not found" };
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return { errCode: 2, errMessage: "Old password is incorrect" };
    }

    const hashedNewPassword = await hashUserPassword(newPassword);
    user.password = hashedNewPassword;

    await user.save();

    return { errCode: 0, errMessage: "Password updated successfully" };
  } catch (error) {
    console.error("Error updating password:", error);
    return { errCode: 3, errMessage: "Server error while updating password" };
  }
};

const forgotPassword = async (email) => {
  try {
    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      return { errCode: 1, errMessage: "Email không tồn tại trong hệ thống" };
    }

    const resetToken = uuidv4();
    user.resetToken = resetToken;
    await user.save();

    const subject = "Khôi phục mật khẩu - Xác nhận tài khoản";
    const htmlContent = `
      <p>Xin chào ${user.username || "bạn"},</p>
      <p>Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng sử dụng mã sau để xác nhận:</p>
      <h3 style="color: #007bff;">${resetToken}</h3>
      <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>
      <p>Trân trọng,<br>Hệ thống hỗ trợ khách hàng</p>
    `;

    await sendEmail(user.email, subject, htmlContent);

    return {
      errCode: 0,
      errMessage: "Mã xác nhận đã được gửi về email của bạn",
    };
  } catch (err) {
    console.error("forgotPassword error:", err);
    return { errCode: 2, errMessage: "Error from server!" };
  }
};

const verifyResetToken = async (email, token) => {
  try {
    const user = await db.User.findOne({ where: { email } });
    if (!user) return { errCode: 1, errMessage: "Email không tồn tại" };

    if (!user.resetToken) {
      return { errCode: 2, errMessage: "Không có yêu cầu khôi phục nào" };
    }

    if (user.resetToken !== token) {
      return { errCode: 3, errMessage: "Mã xác nhận không hợp lệ" };
    }

    return { errCode: 0, errMessage: "Mã xác nhận hợp lệ" };
  } catch (err) {
    console.error("verifyResetToken error:", err);
    return { errCode: 2, errMessage: "Error from server!" };
  }
};

const resetPassword = async (email, token, newPassword) => {
  try {
    const user = await db.User.findOne({ where: { email } });
    if (!user) return { errCode: 1, errMessage: "Email không tồn tại" };

    if (user.resetToken !== token) {
      return {
        errCode: 2,
        errMessage: "Mã xác nhận không hợp lệ hoặc đã hết hạn",
      };
    }

    const hashedPassword = await hashUserPassword(newPassword);
    user.password = hashedPassword;
    user.resetToken = null;
    await user.save();

    return { errCode: 0, errMessage: "Đổi mật khẩu thành công" };
  } catch (err) {
    console.error("resetPassword error:", err);
    return { errCode: 2, errMessage: "Error from server!" };
  }
};
module.exports = {
  createNewUser,
  handleUserLogin,
  verifyRefreshToken,
  generateAccessToken,
  updateUser,
  getAllUsers,
  getUserById,
  deleteUser,
  updateUserPassword,
  verifyResetToken,
  resetPassword,
  forgotPassword,
};
