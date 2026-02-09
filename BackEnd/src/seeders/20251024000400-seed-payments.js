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
    const existing = await countRows(queryInterface, Sequelize, "Payments");
    if (existing > 0) return;

    const orders = await queryInterface.sequelize.query(
      "SELECT id, userId, totalPrice, paymentMethod FROM Orders",
      { type: Sequelize.QueryTypes.SELECT },
    );
    if (!orders.length) return;

    const now = new Date();
    const payments = orders.map((o) => ({
      orderId: o.id,
      userId: o.userId,
      amount: Number(o.totalPrice) || 0,
      method: o.paymentMethod || "cod",
      status: "pending",
      paymentDate: now,
      transactionId: `TX-${o.id}`,
      note: null,
      createdAt: now,
      updatedAt: now,
    }));

    await queryInterface.bulkInsert("Payments", payments, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Payments", null, {});
  },
};
