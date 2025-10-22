"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Products", [
      {
        name: "iPhone 15 Pro Max",
        description: "Điện thoại cao cấp nhất của Apple năm 2024",
        price: 33990000,
        stock: 25,
        image: null,
        sku: "IP15PMAX",
        discount: 5.0,
        isActive: true,
        categoryId: 1, // Điện thoại
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Samsung Galaxy S24 Ultra",
        description: "Siêu phẩm flagship của Samsung",
        price: 30990000,
        stock: 18,
        image: null,
        sku: "SGS24U",
        discount: 10.0,
        isActive: true,
        categoryId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "MacBook Air M3 2025",
        description: "Laptop mỏng nhẹ, pin lâu, hiệu năng cao",
        price: 28990000,
        stock: 12,
        image: null,
        sku: "MBA2025",
        discount: 0.0,
        isActive: true,
        categoryId: 2, // Laptop
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Logitech MX Master 3S",
        description: "Chuột không dây cao cấp cho dân văn phòng",
        price: 2390000,
        stock: 50,
        image: null,
        sku: "LTMX3S",
        discount: 15.0,
        isActive: true,
        categoryId: 3, // Phụ kiện
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Tai nghe AirPods Pro 2",
        description: "Tai nghe chống ồn chủ động, âm thanh cực đỉnh",
        price: 6290000,
        stock: 30,
        image: null,
        sku: "APPRO2",
        discount: 5.0,
        isActive: true,
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
