const request = require("supertest");
const app = require("../src/service");

describe("Product API", () => {
  it("GET /api/v1/product/get-all-product should return 200 and a list of products", async () => {
    const res = await request(app).get("/api/v1/product/get-all-product");

    expect(res.statusCode).toBe(200);
    expect(res.body.errCode).toBe(0);
    expect(Array.isArray(res.body.products || res.body.data)).toBe(true);
  });
});
