"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Products", {
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
      sold: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      stock: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      discount: {
        type: Sequelize.DECIMAL(5, 2),
        defaultValue: 0.0,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      image: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      // Thông số điện tử
      color: { type: Sequelize.STRING, allowNull: true },
      ram: { type: Sequelize.STRING, allowNull: true },
      rom: { type: Sequelize.STRING, allowNull: true },
      screen: { type: Sequelize.STRING, allowNull: true },
      cpu: { type: Sequelize.STRING, allowNull: true },
      battery: { type: Sequelize.STRING, allowNull: true },
      weight: { type: Sequelize.STRING, allowNull: true },
      connectivity: { type: Sequelize.STRING, allowNull: true },
      os: { type: Sequelize.STRING, allowNull: true },
      extra: { type: Sequelize.TEXT, allowNull: true },

      categoryId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        // references: { model: "Categories", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      brandId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        // references: { model: "Brands", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        ),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Products");
  },
};
