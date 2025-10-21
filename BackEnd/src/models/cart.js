"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    static associate(models) {
      // 🧍 Mỗi giỏ hàng thuộc về 1 người dùng
      Cart.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });

      // 🛒 Một giỏ hàng có nhiều sản phẩm (CartItems)
      Cart.hasMany(models.CartItem, {
        foreignKey: "cartId",
        as: "cartItems",
        onDelete: "CASCADE",
      });
    }
  }

  Cart.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // references: {
        //   model: "Users",
        //   key: "id",
        // },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    },
    {
      sequelize,
      modelName: "Cart",
      tableName: "Carts",
      timestamps: true,
    }
  );

  return Cart;
};
