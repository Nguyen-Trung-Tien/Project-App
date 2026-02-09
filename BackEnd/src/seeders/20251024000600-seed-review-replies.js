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
    const existing = await countRows(queryInterface, Sequelize, "ReviewReplies");
    if (existing > 0) return;

    const reviews = await queryInterface.sequelize.query(
      "SELECT id FROM Reviews ORDER BY id ASC",
      { type: Sequelize.QueryTypes.SELECT },
    );
    const users = await queryInterface.sequelize.query(
      "SELECT id FROM Users ORDER BY id ASC",
      { type: Sequelize.QueryTypes.SELECT },
    );
    if (!reviews.length || !users.length) return;

    const now = new Date();
    const replies = reviews.slice(0, 5).map((r, idx) => ({
      reviewId: r.id,
      userId: users[idx % users.length].id,
      comment: `Auto reply ${idx + 1}`,
      createdAt: now,
      updatedAt: now,
    }));

    await queryInterface.bulkInsert("ReviewReplies", replies, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("ReviewReplies", null, {});
  },
};
