/**
 * @jest-environment node
 */

import request from "supertest";
import app from "../app.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

describe("Auth Middleware", () => {

  it("should deny access when no token is provided", async () => {
    const res = await request(app).get("/api/sweets"); // protected later
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Unauthorized");
  });

  it("should allow access when valid token is provided", async () => {
    const token = jwt.sign(
      { id: "12345", role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const res = await request(app)
      .get("/api/sweets") // this will be protected later
      .set("Authorization", `Bearer ${token}`);

    // Since sweets is currently public, expect 200 for now
    expect(res.status).toBe(200);
  });
});
