"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      // Mỗi Order thuộc về một User
      Order.belongsTo(models.User, { foreignKey: "userId", as: "user" });

      // Một Order có nhiều OrderItem
      Order.hasMany(models.OrderItem, {
        foreignKey: "orderId",
        as: "orderItems",
        onDelete: "CASCADE",
      });
    }
  }

  Order.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // references: { model: "Users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      totalPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      // Trạng thái đơn hàng
      status: {
        type: DataTypes.ENUM(
          "pending", // chờ xử lý
          "confirmed", // khách xác nhận
          "processing",
          "shipped",
          "delivered",
          "cancelled" // khách hủy
        ),
        defaultValue: "pending",
      },
      // Lịch sử xác nhận/hủy đơn hàng
      confirmationHistory: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
        comment:
          "Lưu lịch sử hành động xác nhận/hủy đơn của khách. Ví dụ: [{status:'confirmed', date:'2025-10-20T10:00:00'}]",
      },
      shippingAddress: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      paymentMethod: {
        type: DataTypes.ENUM("cod", "bank", "paypal", "momo"),
        defaultValue: "cod",
      },
      paymentStatus: {
        type: DataTypes.ENUM("unpaid", "paid", "refunded"),
        defaultValue: "unpaid",
      },
      orderDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      deliveredAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      note: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Order",
      tableName: "Orders",
      timestamps: true,
    }
  );

  return Order;
};
