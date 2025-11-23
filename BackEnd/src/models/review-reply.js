"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ReviewReply extends Model {
    static associate(models) {
      // Reply thuộc về Review
      ReviewReply.belongsTo(models.Review, {
        foreignKey: "reviewId",
        as: "review",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });

      // Reply thuộc về User
      ReviewReply.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }

  ReviewReply.init(
    {
      reviewId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Reviews", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Users", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: "Nội dung phản hồi cho review",
      },
    },
    {
      sequelize,
      modelName: "ReviewReply",
      tableName: "ReviewReplies",
      timestamps: true,
    }
  );

  return ReviewReply;
};
