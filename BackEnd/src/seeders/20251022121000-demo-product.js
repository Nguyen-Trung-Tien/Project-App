"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Products", [
      {
        sku: "SP001",
        name: "Samsung Galaxy S25",
        description: "Điện thoại flagship mới nhất của Samsung",
        price: 999.99,
        stock: 20,
        discount: 10.0,
        isActive: true,
        image: null,
        categoryId: 1, // Điện thoại
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        sku: "SP002",
        name: "MacBook Pro 16",
        description: "Laptop cao cấp cho học tập và làm việc",
        price: 2499.99,
        stock: 10,
        discount: 5.0,
        isActive: true,
        image: null,
        categoryId: 2, // Laptop
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        sku: "SP003",
        name: "Tai nghe Bluetooth XYZ",
        description: "Phụ kiện âm thanh chất lượng cao",
        price: 199.99,
        stock: 50,
        discount: 0.0,
        isActive: true,
        image: null,
        categoryId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Products", null, {});
  },
};
