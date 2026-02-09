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
    const existing = await countRows(queryInterface, Sequelize, "Users");
    if (existing > 0) return;

    const now = new Date();
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          username: "admin",
          email: "admin@example.com",
          password: "$10$NLHdvTEaR.F.V1klgPJdtuFARFpsaKRZ0808FSfqfvZIORlViB5bq",
          role: "admin",
          isActive: true,
          createdAt: now,
          updatedAt: now,
        },
        {
          username: "user1",
          email: "user1@example.com",
          password: "$10$NLHdvTEaR.F.V1klgPJdtuFARFpsaKRZ0808FSfqfvZIORlViB5bq",
          role: "customer",
          isActive: true,
          createdAt: now,
          updatedAt: now,
        },
        {
          username: "user2",
          email: "user2@example.com",
          password: "$10$NLHdvTEaR.F.V1klgPJdtuFARFpsaKRZ0808FSfqfvZIORlViB5bq",
          role: "customer",
          isActive: true,
          createdAt: now,
          updatedAt: now,
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
