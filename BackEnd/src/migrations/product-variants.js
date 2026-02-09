"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ProductVariants", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      sku: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      stock: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      attributes: {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: {},
      },
      imageUrl: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // references: {
        //   model: "Products",
        //   key: "id",
        // },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("ProductVariants");
  },
};
