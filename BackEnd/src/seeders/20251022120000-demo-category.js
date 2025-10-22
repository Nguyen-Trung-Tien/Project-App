"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Categories", [
      {
        name: "Điện thoại",
        slug: "dien-thoai",
        description: "Các sản phẩm điện thoại thông minh hiện đại",
        image: null,
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Laptop",
        slug: "laptop",
        description: "Máy tính xách tay cho học tập và làm việc",
        image: null,
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Phụ kiện",
        slug: "phu-kien",
        description: "Phụ kiện điện tử các loại",
        image: null,
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Categories", null, {});
  },
};
