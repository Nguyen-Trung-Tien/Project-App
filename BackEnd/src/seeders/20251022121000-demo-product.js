"use strict";

const fs = require("fs");
const { TextDecoder } = require("util");

const CSV_PATH = "C:\\Users\\trung\\Downloads\\u.csv";

const parseCsv = (content) => {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < content.length; i++) {
    const ch = content[i];
    const next = content[i + 1];

    if (inQuotes) {
      if (ch === "\"" && next === "\"") {
        field += "\"";
        i += 1;
      } else if (ch === "\"") {
        inQuotes = false;
      } else {
        field += ch;
      }
      continue;
    }

    if (ch === "\"") {
      inQuotes = true;
      continue;
    }

    if (ch === ",") {
      row.push(field);
      field = "";
      continue;
    }

    if (ch === "\n") {
      row.push(field);
      field = "";
      if (row.length > 1 || row[0] !== "") rows.push(row);
      row = [];
      continue;
    }

    if (ch === "\r") continue;

    field += ch;
  }

  row.push(field);
  if (row.length > 1 || row[0] !== "") rows.push(row);
  return rows;
};

const toNull = (value) => {
  if (value === undefined || value === null) return null;
  const str = String(value).trim();
  return str === "" ? null : str;
};

const toNumber = (value, fallback = 0) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const toInt = (value, fallback = 0) => {
  const n = parseInt(value, 10);
  return Number.isFinite(n) ? n : fallback;
};

const toBool = (value) => {
  const str = String(value).trim().toLowerCase();
  return str === "1" || str === "true" || str === "yes";
};

const toDate = (value) => {
  const v = toNull(value);
  if (!v) return new Date();
  const iso = v.includes("T") ? v : v.replace(" ", "T");
  const d = new Date(iso);
  return isNaN(d.getTime()) ? new Date() : d;
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

const normalizeName = (value) => {
  if (!value) return value;
  if (value.length <= 255) return value;
  return value.slice(0, 255);
};

const loadCsvProducts = () => {
  if (!fs.existsSync(CSV_PATH)) {
    throw new Error(`CSV not found: ${CSV_PATH}`);
  }
  const raw = fs.readFileSync(CSV_PATH);
  const text = new TextDecoder("windows-1258").decode(raw);
  const rows = parseCsv(text);
  if (!rows.length) return [];

  const headers = rows[0].map((h) => h.trim());
  const dataRows = rows.slice(1);

  return dataRows.map((cols, idx) => {
    const obj = {};
    headers.forEach((h, idx) => {
      obj[h] = cols[idx] ?? "";
    });
    const id = toInt(obj.id, null);
    const fallbackSku = id ? `SKU-${id}` : `CSV-${idx + 1}`;
    const sku = normalizeSku(toNull(obj.sku) || fallbackSku);
    const name = normalizeName(toNull(obj.name) || `Product ${sku}`);
    return {
      id,
      sku,
      name,
      description: toNull(obj.description),
      price: toNumber(obj.price, 0),
      stock: Math.max(0, toInt(obj.stock, 0)),
      discount: toNumber(obj.discount, 0),
      isActive: toBool(obj.isActive),
      image: toNull(obj.image),
      categoryId: toInt(obj.categoryId, null),
      createdAt: toDate(obj.createdAt),
      updatedAt: toDate(obj.updatedAt),
      sold: Math.max(0, toInt(obj.sold, 0)),
      brandId: toInt(obj.brandId, null),
      color: toNull(obj.color),
      ram: toNull(obj.ram),
      rom: toNull(obj.rom),
      screen: toNull(obj.screen),
      cpu: toNull(obj.cpu),
      battery: toNull(obj.battery),
      weight: toNull(obj.weight),
      connectivity: toNull(obj.connectivity),
      os: toNull(obj.os),
      extra: toNull(obj.extra),
    };
  });
};

const ensureUniqueSkus = (products) => {
  const seen = new Map();
  return products.map((p) => {
    const base = p.sku || "CSV";
    const count = seen.get(base) || 0;
    seen.set(base, count + 1);
    if (count === 0) return p;
    return { ...p, sku: normalizeSku(`${base}-dup${count}`) };
  });
};

const ensureUniqueIds = (products) => {
  const seen = new Set();
  return products.map((p) => {
    if (!p.id || seen.has(p.id)) {
      return { ...p, id: null };
    }
    seen.add(p.id);
    return p;
  });
};

const countRows = async (queryInterface, Sequelize, table) => {
  const res = await queryInterface.sequelize.query(
    `SELECT COUNT(*) as count FROM \`${table}\``,
    { type: Sequelize.QueryTypes.SELECT },
  );
  return Number(res[0]?.count || 0);
};

module.exports = {
  async up(queryInterface, Sequelize) {
    const existing = await countRows(queryInterface, Sequelize, "Products");
    if (existing > 0) return;

    const transaction = await queryInterface.sequelize.transaction();
    try {
      const products = ensureUniqueSkus(ensureUniqueIds(loadCsvProducts()));
      if (!products.length) {
        await transaction.commit();
        return;
      }

      const categoryIds = [
        ...new Set(products.map((p) => p.categoryId).filter(Boolean)),
      ];
      const brandIds = [
        ...new Set(products.map((p) => p.brandId).filter(Boolean)),
      ];

      if (categoryIds.length) {
        const found = await queryInterface.sequelize.query(
          "SELECT id FROM Categories WHERE id IN (:ids)",
          {
            replacements: { ids: categoryIds },
            type: Sequelize.QueryTypes.SELECT,
            transaction,
          },
        );
        const foundSet = new Set(found.map((r) => r.id));
        const missing = categoryIds.filter((id) => !foundSet.has(id));
        if (missing.length) {
          throw new Error(`Missing categoryId(s): ${missing.join(", ")}`);
        }
      }

      if (brandIds.length) {
        const found = await queryInterface.sequelize.query(
          "SELECT id FROM Brands WHERE id IN (:ids)",
          {
            replacements: { ids: brandIds },
            type: Sequelize.QueryTypes.SELECT,
            transaction,
          },
        );
        const foundSet = new Set(found.map((r) => r.id));
        const missing = brandIds.filter((id) => !foundSet.has(id));
        if (missing.length) {
          throw new Error(`Missing brandId(s): ${missing.join(", ")}`);
        }
      }

      await queryInterface.bulkInsert("Products", products, { transaction });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    const products = loadCsvProducts();
    const ids = products.map((p) => p.id).filter(Boolean);
    if (ids.length) {
      await queryInterface.bulkDelete("Products", { id: ids }, {});
    }
  },
};
