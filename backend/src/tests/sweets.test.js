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

  it("should return all sweets", async () => {
  // First create one sweet (so the DB isn't empty)
  await request(app).post("/api/sweets").send({
    name: "Candy Pop",
    category: "Candy",
    price: 10,
    quantity: 100
  });

  const res = await request(app).get("/api/sweets");

  expect(res.status).toBe(200);
  expect(Array.isArray(res.body.data)).toBe(true);
  expect(res.body.data.length).toBeGreaterThan(0);
});
});
