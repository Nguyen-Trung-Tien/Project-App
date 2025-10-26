"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.User, { foreignKey: "userId", as: "user" });

      Order.hasMany(models.OrderItem, {
        foreignKey: "orderId",
        as: "orderItems",
        onDelete: "CASCADE",
      });
      Order.hasOne(models.Payment, {
        foreignKey: "orderId",
        as: "payment",
        onDelete: "CASCADE",
      });
    }
  }

  Order.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      totalPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
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
      confirmationHistory: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
        comment: "Lưu lịch sử hành động xác nhận/hủy đơn của khách.",
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
