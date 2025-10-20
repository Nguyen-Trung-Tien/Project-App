"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.belongsTo(models.Category, {
        foreignKey: "categoryId",
        as: "category",
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      });

      Product.hasMany(models.CartItem, {
        foreignKey: "productId",
        as: "cartItems",
        onDelete: "CASCADE",
      });

      Product.hasMany(models.OrderItem, {
        foreignKey: "productId",
        as: "orderItems",
        onDelete: "CASCADE",
      });

      Product.hasMany(models.Review, {
        foreignKey: "productId",
        as: "reviews",
        onDelete: "CASCADE",
      });
    }
  }

  Product.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: { min: 0 },
      },
      stock: { type: DataTypes.INTEGER, defaultValue: 0, validate: { min: 0 } },
      image: { type: DataTypes.STRING },
      sku: { type: DataTypes.STRING, unique: true, allowNull: true },
      discount: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0.0 },
      isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: "Categories", key: "id" },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      },
    },
    {
      sequelize,
      modelName: "Product",
      tableName: "Products",
      timestamps: true,
    }
  );

  return Product;
};
