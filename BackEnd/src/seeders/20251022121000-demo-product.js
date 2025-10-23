"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const products = [];

    const categories = [
      { id: 1, name: "Điện thoại" },
      { id: 2, name: "Laptop" },
      { id: 3, name: "Phụ kiện" },
      { id: 4, name: "Tablet" },
      { id: 5, name: "Smartwatch" },
    ];

    for (let i = 1; i <= 100; i++) {
      const category = categories[i % categories.length];
      products.push({
        sku: `SP${i.toString().padStart(3, "0")}`,
        name: `${category.name} mẫu ${i}`,
        description: `Mô tả chi tiết cho sản phẩm ${i} thuộc danh mục ${category.name}`,
        price: parseFloat((Math.random() * 2000 + 50).toFixed(2)),
        stock: Math.floor(Math.random() * 100) + 1,
        discount: parseFloat((Math.random() * 20).toFixed(2)),
        isActive: true,
        image: null,
        categoryId: category.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await queryInterface.bulkInsert("Products", products);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Products", null, {});
  },
};
