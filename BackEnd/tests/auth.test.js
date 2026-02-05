const request = require("supertest");
const app = require("../src/service");

describe("Auth API", () => {
  it("POST /api/v1/user/login should return 400 if email or password missing", async () => {
    const res = await request(app).post("/api/v1/user/login").send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.errCode).toBe(3);
  });
});
