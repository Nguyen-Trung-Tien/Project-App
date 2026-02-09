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
    const existing = await countRows(queryInterface, Sequelize, "Reviews");
    if (existing > 0) return;

    const users = await queryInterface.sequelize.query(
      "SELECT id FROM Users ORDER BY id ASC",
      { type: Sequelize.QueryTypes.SELECT },
    );
    const products = await queryInterface.sequelize.query(
      "SELECT id FROM Products ORDER BY id ASC",
      { type: Sequelize.QueryTypes.SELECT },
    );
    if (!users.length || !products.length) return;

    const now = new Date();
    const reviews = [];
    const maxReviews = Math.min(products.length, 10);

    for (let i = 0; i < maxReviews; i++) {
      const user = users[i % users.length];
      const product = products[i];
      reviews.push({
        userId: user.id,
        productId: product.id,
        rating: 5 - (i % 5),
        comment: `Auto review ${i + 1}`,
        isApproved: true,
        createdAt: now,
        updatedAt: now,
      });
    }

    await queryInterface.bulkInsert("Reviews", reviews, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Reviews", null, {});
  },
};
