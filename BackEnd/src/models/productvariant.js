"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ProductVariant extends Model {
    static associate(models) {
      ProductVariant.belongsTo(models.Product, {
        foreignKey: "productId",
        as: "product",
        onDelete: "CASCADE",
      });
    }
  }

  ProductVariant.init(
    {
      sku: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: { min: 0 },
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0 },
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      attributes: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
      },
      imageUrl: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "ProductVariant",
      tableName: "ProductVariants",
      timestamps: true,
    }
  );

  return ProductVariant;
};
