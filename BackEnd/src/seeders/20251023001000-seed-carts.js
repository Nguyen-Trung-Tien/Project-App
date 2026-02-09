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
    const existing = await countRows(queryInterface, Sequelize, "Carts");
    if (existing > 0) return;

    const users = await queryInterface.sequelize.query(
      "SELECT id FROM Users",
      { type: Sequelize.QueryTypes.SELECT },
    );
    if (!users.length) return;

    const now = new Date();
    const carts = users.map((u) => ({
      userId: u.id,
      createdAt: now,
      updatedAt: now,
    }));

    await queryInterface.bulkInsert("Carts", carts, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Carts", null, {});
  },
};
