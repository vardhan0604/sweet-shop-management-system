/**
 * @jest-environment node
 */

import request from "supertest";
import app from "../app.js";
import jwt from "jsonwebtoken";

const userToken = jwt.sign(
  { id: "user123", role: "user" },
  process.env.JWT_SECRET,
  { expiresIn: "1d" }
);

const adminToken = jwt.sign(
  { id: "admin123", role: "admin" },
  process.env.JWT_SECRET,
  { expiresIn: "1d" }
);

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
      .set("Authorization", `Bearer ${adminToken}`) // ADMIN REQUIRED
      .send(sweetData);

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Sweet created successfully");
    expect(res.body.data.name).toBe("Chocolate Bar");
  });

  it("should return all sweets", async () => {

    await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Candy Pop",
        category: "Candy",
        price: 10,
        quantity: 100
      });

    const res = await request(app)
      .get("/api/sweets")
      .set("Authorization", `Bearer ${userToken}`); // USER OK

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it("should search sweets by name", async () => {

    await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Milk Chocolate",
        category: "Chocolate",
        price: 80,
        quantity: 20
      });

    await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Dark Chocolate",
        category: "Chocolate",
        price: 100,
        quantity: 15
      });

    const res = await request(app)
      .get("/api/sweets/search?name=Milk")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].name).toBe("Milk Chocolate");
  });

  it("should search sweets by category", async () => {

    await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Gummy Bears",
        category: "Candy",
        price: 30,
        quantity: 50
      });

    await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Chocolate Bar",
        category: "Chocolate",
        price: 50,
        quantity: 20
      });

    const res = await request(app)
      .get("/api/sweets/search?category=Candy")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].category).toBe("Candy");
  });

  it("should search sweets by price range", async () => {

    await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Milk Chocolate",
        category: "Chocolate",
        price: 80,
        quantity: 20
      });

    await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Candy Pop",
        category: "Candy",
        price: 10,
        quantity: 100
      });

    const res = await request(app)
      .get("/api/sweets/search?minPrice=50&maxPrice=100")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].price).toBe(80);
  });

  it("should update a sweet", async () => {

    const createRes = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Lollipop",
        category: "Candy",
        price: 5,
        quantity: 10
      });

    const id = createRes.body.data._id;

    const updateRes = await request(app)
      .put(`/api/sweets/${id}`)
      .set("Authorization", `Bearer ${adminToken}`) // ADMIN REQUIRED
      .send({
        name: "Lollipop XL",
        category: "Candy",
        price: 8,
        quantity: 20
      });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.data.name).toBe("Lollipop XL");
  });

  it("should delete a sweet", async () => {

    const createRes = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Toffee",
        category: "Candy",
        price: 5,
        quantity: 50
      });

    const id = createRes.body.data._id;

    const deleteRes = await request(app)
      .delete(`/api/sweets/${id}`)
      .set("Authorization", `Bearer ${adminToken}`); // ADMIN REQUIRED

    expect(deleteRes.status).toBe(200);

    const getRes = await request(app)
      .get("/api/sweets")
      .set("Authorization", `Bearer ${userToken}`);

    expect(getRes.body.data.length).toBe(0);
  });

  it("should purchase a sweet and reduce quantity by 1", async () => {

    const createRes = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Jelly Cup",
        category: "Candy",
        price: 25,
        quantity: 5
      });

    const id = createRes.body.data._id;

    const purchaseRes = await request(app)
      .post(`/api/sweets/${id}/purchase`)
      .set("Authorization", `Bearer ${userToken}`)
      .send();

    expect(purchaseRes.status).toBe(200);
    expect(purchaseRes.body.data.quantity).toBe(4);
  });

  it("should restock a sweet and increase quantity by 1", async () => {

    const createRes = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Mint Candy",
        category: "Candy",
        price: 15,
        quantity: 2
      });

    const id = createRes.body.data._id;

    const restockRes = await request(app)
      .post(`/api/sweets/${id}/restock`)
      .set("Authorization", `Bearer ${adminToken}`) // ADMIN REQUIRED
      .send();

    expect(restockRes.status).toBe(200);
    expect(restockRes.body.data.quantity).toBe(3);
  });

});
