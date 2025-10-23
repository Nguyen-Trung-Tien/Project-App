"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1️⃣ Thêm 5 danh mục
    const categories = [
      {
        id: 1,
        name: "Điện thoại",
        slug: "dien-thoai",
        description: "Điện thoại thông minh hiện đại",
      },
      {
        id: 2,
        name: "Laptop",
        slug: "laptop",
        description: "Máy tính xách tay cho học tập và làm việc",
      },
      {
        id: 3,
        name: "Phụ kiện",
        slug: "phu-kien",
        description: "Phụ kiện điện tử các loại",
      },
      {
        id: 4,
        name: "Tablet",
        slug: "tablet",
        description: "Máy tính bảng các loại",
      },
      {
        id: 5,
        name: "Smartwatch",
        slug: "smartwatch",
        description: "Đồng hồ thông minh",
      },
    ];

    const categoryData = categories.map((c) => ({
      ...c,
      image: null,
      parentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert("Categories", categoryData);

    // 2️⃣ Thêm 100 sản phẩm
    const products = [];
    for (let i = 1; i <= 100; i++) {
      const category = categories[i % categories.length]; // phân loại luân phiên
      products.push({
        sku: `SP${i.toString().padStart(3, "0")}`,
        name: `${category.name} mẫu ${i}`,
        description: `Mô tả chi tiết cho sản phẩm ${i} thuộc danh mục ${category.name}`,
        price: parseFloat((Math.random() * 2000 + 50).toFixed(2)), // giá 50 -> 2050
        stock: Math.floor(Math.random() * 100) + 1, // 1 -> 100
        discount: parseFloat((Math.random() * 20).toFixed(2)), // giảm giá 0 -> 20%
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
    await queryInterface.bulkDelete("Categories", null, {});
  },
};
