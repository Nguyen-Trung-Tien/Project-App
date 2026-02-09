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

const loadCsvBrandIds = () => {
  if (!fs.existsSync(CSV_PATH)) {
    throw new Error(`CSV not found: ${CSV_PATH}`);
  }
  const raw = fs.readFileSync(CSV_PATH);
  const text = new TextDecoder("windows-1258").decode(raw);
  const rows = parseCsv(text);
  if (rows.length < 2) return [];
  const headers = rows[0].map((h) => h.trim());
  const brandIdx = headers.indexOf("brandId");
  if (brandIdx === -1) return [];
  const ids = new Set();
  for (let i = 1; i < rows.length; i++) {
    const val = rows[i][brandIdx];
    const id = parseInt(val, 10);
    if (Number.isFinite(id)) ids.add(id);
  }
  return Array.from(ids);
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
    const existing = await countRows(queryInterface, Sequelize, "Brands");
    if (existing > 0) return;

    const now = new Date();
    const ids = loadCsvBrandIds();
    if (!ids.length) return;

    const brands = ids.map((id) => ({
      id,
      name: `Brand ${id}`,
      slug: `brand-${id}`,
      description: `Auto seeded from CSV (brandId=${id}).`,
      image: null,
      createdAt: now,
      updatedAt: now,
    }));

    await queryInterface.bulkInsert("Brands", brands);
  },

  async down(queryInterface, Sequelize) {
    const ids = loadCsvBrandIds();
    if (ids.length) {
      await queryInterface.bulkDelete("Brands", { id: ids }, {});
    }
  },
};
