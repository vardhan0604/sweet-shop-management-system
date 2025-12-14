/**
 * @jest-environment node
 */

import request from "supertest";
import app from "../app.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

describe("Admin Middleware", () => {

  it("should deny access if user is not admin", async () => {
    const token = jwt.sign(
      { id: "12345", role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const res = await request(app)
      .post("/api/sweets")          // admin route
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Test",
        category: "Candy",
        price: 10,
        quantity: 10
      });

    expect(res.status).toBe(403);
    expect(res.body.message).toBe("Access denied. Admin only");
  });

  it("should allow access if user is admin", async () => {
    const token = jwt.sign(
      { id: "12345", role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const res = await request(app)
      .post("/api/sweets")          // admin route
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Test Admin",
        category: "Candy",
        price: 20,
        quantity: 20
      });

    // It should reach the controller, so expect 201
    expect(res.status).toBe(201);
  });

});
