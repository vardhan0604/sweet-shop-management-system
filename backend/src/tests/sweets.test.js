/**
 * @jest-environment node
 */

import request from "supertest";
import app from "../app.js";

describe("Sweets API", () => {
  it("should create a new sweet", async () => {
    const sweetData = {
      name: "Chocolate Bar",
      category: "Chocolate",
      price: 50,
      quantity: 20
    };

    const res = await request(app)
      .post("/api/sweets")
      .send(sweetData);

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Sweet created successfully");
    expect(res.body.data.name).toBe("Chocolate Bar");
  });
});
