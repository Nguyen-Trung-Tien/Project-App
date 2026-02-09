"use strict";

const countRows = async (queryInterface, Sequelize, table) => {
  const res = await queryInterface.sequelize.query(
    `SELECT COUNT(*) as count FROM \`${table}\``,
    { type: Sequelize.QueryTypes.SELECT },
  );
  return Number(res[0]?.count || 0);
};

const hashString = (value) => {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash.toString(36);
};

const normalizeSku = (value) => {
  if (!value) return value;
  if (value.length <= 255) return value;
  const suffix = `-${hashString(value)}`;
  const maxPrefix = 255 - suffix.length;
  return `${value.slice(0, Math.max(0, maxPrefix))}${suffix}`;
};

module.exports = {
  async up(queryInterface, Sequelize) {
    const existing = await countRows(queryInterface, Sequelize, "ProductVariants");
    if (existing > 0) return;

    const products = await queryInterface.sequelize.query(
      "SELECT id, sku, price, stock, ram, rom, os, color, image FROM Products",
      { type: Sequelize.QueryTypes.SELECT },
    );
    if (!products.length) return;

    const now = new Date();
    const variants = products.map((p) => {
      const attributes = {};
      if (p.ram) attributes.ram = p.ram;
      if (p.rom) attributes.rom = p.rom;
      if (p.os) attributes.os = p.os;
      if (p.color) attributes.color = p.color;

      const rawSku = p.sku ? `${p.sku}-V1` : `PV-${p.id}`;
      return {
        productId: p.id,
        sku: normalizeSku(rawSku),
        price: p.price || 0,
        stock: p.stock || 0,
        isActive: true,
        attributes: JSON.stringify(attributes),
        imageUrl: p.image || null,
        createdAt: now,
        updatedAt: now,
      };
    });

    await queryInterface.bulkInsert("ProductVariants", variants, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("ProductVariants", null, {});
  },
};
