"use strict";

const countRows = async (queryInterface, Sequelize, table) => {
  const res = await queryInterface.sequelize.query(
    `SELECT COUNT(*) as count FROM \`${table}\``,
    { type: Sequelize.QueryTypes.SELECT },
  );
  return Number(res[0]?.count || 0);
};

module.exports = {
  async up(queryInterface, Sequelize) {
    const existing = await countRows(queryInterface, Sequelize, "ProductImages");
    if (existing > 0) return;

    const products = await queryInterface.sequelize.query(
      "SELECT id, image FROM Products",
      { type: Sequelize.QueryTypes.SELECT },
    );
    if (!products.length) return;

    const now = new Date();
    const images = products
      .filter((p) => p.image)
      .map((p) => ({
        productId: p.id,
        imageUrl: p.image,
        publicId: null,
        isPrimary: true,
        createdAt: now,
        updatedAt: now,
      }));

    if (images.length) {
      await queryInterface.bulkInsert("ProductImages", images, {});
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("ProductImages", null, {});
  },
};
