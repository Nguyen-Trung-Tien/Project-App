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
    const existing = await countRows(queryInterface, Sequelize, "OrderItems");
    if (existing > 0) return;

    const orders = await queryInterface.sequelize.query(
      "SELECT id FROM Orders ORDER BY id ASC",
      { type: Sequelize.QueryTypes.SELECT },
    );
    const products = await queryInterface.sequelize.query(
      "SELECT id, name, price FROM Products ORDER BY id ASC",
      { type: Sequelize.QueryTypes.SELECT },
    );
    if (!orders.length || !products.length) return;

    const now = new Date();
    const items = [];
    const totals = new Map();

    orders.forEach((order, idx) => {
      const product = products[idx % products.length];
      const quantity = 1 + (idx % 2);
      const price = Number(product.price) || 0;
      const subtotal = price * quantity;
      items.push({
        orderId: order.id,
        productId: product.id,
        quantity,
        price,
        subtotal,
        productName: product.name,
        image: null,
        returnStatus: "none",
        returnReason: null,
        returnRequestedAt: null,
        returnProcessedAt: null,
        createdAt: now,
        updatedAt: now,
      });
      totals.set(order.id, (totals.get(order.id) || 0) + subtotal);
    });

    await queryInterface.bulkInsert("OrderItems", items, {});

    for (const [orderId, total] of totals.entries()) {
      await queryInterface.sequelize.query(
        "UPDATE Orders SET totalPrice = :total WHERE id = :id",
        { replacements: { total, id: orderId } },
      );
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("OrderItems", null, {});
  },
};
