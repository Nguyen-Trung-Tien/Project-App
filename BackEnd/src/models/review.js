"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {
      // 🔹 Review thuộc về User
      Review.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });

      // 🔹 Review thuộc về Product
      Review.belongsTo(models.Product, {
        foreignKey: "productId",
        as: "product",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }

  Review.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // references: { model: "Users", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // references: { model: "Products", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1, max: 5 },
        comment: "Số sao đánh giá sản phẩm (1-5)",
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "Nội dung đánh giá sản phẩm",
      },
      isApproved: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "Review",
      tableName: "Reviews",
      timestamps: true,
    }
  );

  return Review;
};
