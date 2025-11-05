const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: `"Support Team" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };
    await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${to}`);
    return true;
  } catch (error) {
    console.error("Email send error:", error);
    return false;
  }
};

const sendForgotPasswordEmail = async (user, token) => {
  const subject = "🔐 Khôi phục mật khẩu - Xác nhận tài khoản";
  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 24px;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); overflow: hidden;">
        <div style="background-color: #0d6efd; color: white; text-align: center; padding: 16px 0;">
          <h2 style="margin: 0; font-size: 22px;">Tien-Tech Shop</h2>
        </div>

        <div style="padding: 24px;">
          <h3 style="color: #2c3e50;">Xin chào ${user.username || "bạn"},</h3>
          <p>Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng sử dụng mã sau để xác nhận:</p>
          <div style="text-align: center; margin: 20px 0;">
            <div style="display: inline-block; background: #eef6ff; border: 1px solid #0d6efd; border-radius: 8px; padding: 12px 24px; font-size: 20px; font-weight: bold; color: #0d6efd;">
              ${token}
            </div>
          </div>
          <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>
          <p style="margin-top: 24px;">Trân trọng,<br>Hệ thống hỗ trợ khách hàng</p>
        </div>

        <div style="background-color: #f3f4f6; text-align: center; padding: 12px;">
          <p style="font-size: 12px; color: #888; margin: 0;">Đây là email tự động, vui lòng không trả lời.</p>
        </div>
      </div>
    </div>
  `;
  return await sendEmail(user.email, subject, html);
};

const sendOrderDeliveredEmail = async (user, order) => {
  if (!user?.email) return false;

  const orderCode = `DH${order.id}`;
  const subject = `🎉 Đơn hàng ${orderCode} của bạn đã được giao thành công!`;
  const clientUrl = process.env.URL_REACT;

  const html = `
  <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 24px;">
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); overflow: hidden;">
      <div style="background-color: #ff6f00; color: white; text-align: center; padding: 16px 0;">
        <h2 style="margin: 0; font-size: 22px;">Tien-Tech Shop</h2>
      </div>

      <div style="padding: 24px;">
        <h3 style="color: #2c3e50;">Xin chào ${
          user.username || "quý khách"
        },</h3>
        <p style="font-size: 15px; color: #333;">
          Chúng tôi xin thông báo rằng đơn hàng <strong style="color: #ff6f00;">${orderCode}</strong> của bạn đã được <b>giao thành công</b>.
        </p>

        <div style="margin: 20px 0; background: #f3f4f6; border-radius: 8px; padding: 16px;">
          <h4 style="margin-bottom: 10px;">📦 Thông tin đơn hàng</h4>
          <ul style="list-style: none; padding: 0; margin: 0;">
            <li><strong>Mã đơn hàng:</strong> ${orderCode}</li>
            <li><strong>Địa chỉ giao hàng:</strong> ${
              order.shippingAddress
            }</li>
            <li><strong>Tổng tiền:</strong> ${order.totalPrice.toLocaleString()}₫</li>
          </ul>
        </div>

        <div style="text-align: center; margin-top: 20px;">
          <a href="${clientUrl}/orders-detail/${order.id}" 
            style="display: inline-block; background-color: #ff6f00; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold;">
            🔍 Xem chi tiết đơn hàng
          </a>
        </div>

        <p style="margin-top: 24px; color: #555;">
          Cảm ơn bạn đã mua sắm tại <b>Shop của chúng tôi</b>! ❤️<br/>
          Nếu có bất kỳ thắc mắc nào, vui lòng phản hồi lại email này hoặc liên hệ đội ngũ hỗ trợ.
        </p>
      </div>

      <div style="background-color: #f3f4f6; text-align: center; padding: 12px;">
        <p style="font-size: 12px; color: #888; margin: 0;">
          Đây là email tự động, vui lòng không trả lời trực tiếp.<br/>
          © ${new Date().getFullYear()} Shop Của Chúng Tôi.
        </p>
      </div>
    </div>
  </div>
  `;

  return await sendEmail(user.email, subject, html);
};

module.exports = {
  sendEmail,
  sendForgotPasswordEmail,
  sendOrderDeliveredEmail,
};
