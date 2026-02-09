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
    const existing = await countRows(queryInterface, Sequelize, "CartItems");
    if (existing > 0) return;

    const carts = await queryInterface.sequelize.query(
      "SELECT id FROM Carts ORDER BY id ASC",
      { type: Sequelize.QueryTypes.SELECT },
    );
    const products = await queryInterface.sequelize.query(
      "SELECT id FROM Products ORDER BY id ASC",
      { type: Sequelize.QueryTypes.SELECT },
    );
    if (!carts.length || !products.length) return;

    const now = new Date();
    const items = [];
    const maxItemsPerCart = 2;

    carts.forEach((cart, idx) => {
      for (let i = 0; i < maxItemsPerCart && i < products.length; i++) {
        const product = products[(idx + i) % products.length];
        items.push({
          cartId: cart.id,
          productId: product.id,
          quantity: (i % 3) + 1,
          createdAt: now,
          updatedAt: now,
        });
      }
    });

    if (items.length) {
      await queryInterface.bulkInsert("CartItems", items, {});
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("CartItems", null, {});
  },
};
