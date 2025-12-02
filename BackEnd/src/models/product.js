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

      Product.belongsTo(models.Brand, {
        foreignKey: "brandId",
        as: "brand",
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
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
      image: { type: DataTypes.BLOB("long") },
      sku: { type: DataTypes.STRING, unique: true, allowNull: true },
      sold: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
        validate: { min: 0 },
      },
      discount: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0.0 },
      isActive: { type: DataTypes.BOOLEAN, defaultValue: true },

      // Thông số điện tử
      color: { type: DataTypes.STRING }, // Màu sắc
      ram: { type: DataTypes.STRING }, // RAM, ví dụ: "8GB"
      rom: { type: DataTypes.STRING }, // ROM / bộ nhớ trong
      screen: { type: DataTypes.STRING }, // Kích thước / loại màn hình
      cpu: { type: DataTypes.STRING }, // CPU / chip
      battery: { type: DataTypes.STRING }, // Pin / dung lượng pin
      weight: { type: DataTypes.STRING }, // Trọng lượng
      connectivity: { type: DataTypes.STRING }, // 4G/5G, WiFi, Bluetooth, ...
      os: { type: DataTypes.STRING }, // Hệ điều hành
      extra: { type: DataTypes.TEXT }, // Thông tin thêm

      brandId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: "Brands", key: "id" },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      },
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
