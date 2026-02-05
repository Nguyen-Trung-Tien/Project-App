const db = require("../src/models");

jest.mock("uuid", () => ({
  v4: () => "00000000-0000-0000-0000-000000000000",
}));

jest.mock("cloudinary", () => ({
  v2: {
    config: jest.fn(),
    uploader: {
      upload_stream: jest.fn(),
    },
  },
}));

beforeAll(async () => {
  try {
    await db.sequelize.authenticate();
    console.log("Test DB Connection established.");
  } catch (error) {
    console.error("Unable to connect to the database in tests:", error);
  }
});

afterAll(async () => {
  if (db.sequelize) {
    await db.sequelize.close();
  }
});
