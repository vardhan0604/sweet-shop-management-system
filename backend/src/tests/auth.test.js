/**
 * @jest-environment node
 */
import request from "supertest";
import app from "../app.js";

describe("Auth API", () => {

  it("should register a user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        email: "test@example.com",
        password: "password123"
      });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("User registered successfully");
  });

  it("should log in a user", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "test@example.com",
        password: "password123"
      });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Login successful");
  });

});
