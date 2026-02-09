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
    const existing = await countRows(queryInterface, Sequelize, "Orders");
    if (existing > 0) return;

    const users = await queryInterface.sequelize.query(
      "SELECT id FROM Users ORDER BY id ASC",
      { type: Sequelize.QueryTypes.SELECT },
    );
    if (!users.length) return;

    const now = new Date();
    const orders = users.map((u, idx) => ({
      orderCode: `ORD-${String(idx + 1).padStart(4, "0")}`,
      userId: u.id,
      totalPrice: 0,
      status: "pending",
      shippingAddress: `Address for user ${u.id}`,
      paymentMethod: "cod",
      paymentStatus: "unpaid",
      orderDate: now,
      deliveredAt: null,
      note: null,
      createdAt: now,
      updatedAt: now,
    }));

    await queryInterface.bulkInsert("Orders", orders, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Orders", null, {});
  },
};
