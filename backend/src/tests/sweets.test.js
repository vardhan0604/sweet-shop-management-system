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

it("should search sweets by name", async () => {
  // Create sample sweets
  await request(app).post("/api/sweets").send({
    name: "Milk Chocolate",
    category: "Chocolate",
    price: 80,
    quantity: 20
  });

  await request(app).post("/api/sweets").send({
    name: "Dark Chocolate",
    category: "Chocolate",
    price: 100,
    quantity: 15
  });

  // Now search
  const res = await request(app).get("/api/sweets/search?name=Milk");

  expect(res.status).toBe(200);
  expect(Array.isArray(res.body.data)).toBe(true);
  expect(res.body.data.length).toBe(1);
  expect(res.body.data[0].name).toBe("Milk Chocolate");
});

it("should search sweets by category", async () => {
  await request(app).post("/api/sweets").send({
    name: "Gummy Bears",
    category: "Candy",
    price: 30,
    quantity: 50
  });

  await request(app).post("/api/sweets").send({
    name: "Chocolate Bar",
    category: "Chocolate",
    price: 50,
    quantity: 20
  });

  const res = await request(app).get("/api/sweets/search?category=Candy");

  expect(res.status).toBe(200);
  expect(res.body.data.length).toBe(1);
  expect(res.body.data[0].category).toBe("Candy");
});

it("should search sweets by price range", async () => {
  await request(app).post("/api/sweets").send({
    name: "Milk Chocolate",
    category: "Chocolate",
    price: 80,
    quantity: 20
  });

  await request(app).post("/api/sweets").send({
    name: "Candy Pop",
    category: "Candy",
    price: 10,
    quantity: 100
  });

  // Search sweets priced between 50 and 100
  const res = await request(app).get("/api/sweets/search?minPrice=50&maxPrice=100");

  expect(res.status).toBe(200);
  expect(res.body.data.length).toBe(1);
  expect(res.body.data[0].price).toBe(80);
});

it("should update a sweet", async () => {
  // Create sweet first
  const createRes = await request(app).post("/api/sweets").send({
    name: "Lollipop",
    category: "Candy",
    price: 5,
    quantity: 10
  });

  const id = createRes.body.data._id;

  // Update sweet
  const updateRes = await request(app).put(`/api/sweets/${id}`).send({
    name: "Lollipop XL",
    category: "Candy",
    price: 8,
    quantity: 20
  });

  expect(updateRes.status).toBe(200);
  expect(updateRes.body.message).toBe("Sweet updated successfully");
  expect(updateRes.body.data.name).toBe("Lollipop XL");
  expect(updateRes.body.data.price).toBe(8);
});

it("should delete a sweet", async () => {
  // Create a sweet first
  const createRes = await request(app).post("/api/sweets").send({
    name: "Toffee",
    category: "Candy",
    price: 5,
    quantity: 50
  });

  const id = createRes.body.data._id;

  // Delete that sweet
  const deleteRes = await request(app).delete(`/api/sweets/${id}`);

  expect(deleteRes.status).toBe(200);
  expect(deleteRes.body.message).toBe("Sweet deleted successfully");

  // Confirm it is gone
  const getRes = await request(app).get("/api/sweets");
  expect(getRes.body.data.length).toBe(0);
});

it("should purchase a sweet and reduce quantity by 1", async () => {
  // Create a sweet
  const createRes = await request(app).post("/api/sweets").send({
    name: "Jelly Cup",
    category: "Candy",
    price: 25,
    quantity: 5
  });

  const id = createRes.body.data._id;

  // Purchase sweet
  const purchaseRes = await request(app)
    .post(`/api/sweets/${id}/purchase`)
    .send();

  expect(purchaseRes.status).toBe(200);
  expect(purchaseRes.body.message).toBe("Sweet purchased successfully");
  expect(purchaseRes.body.data.quantity).toBe(4); // reduced by 1
});
});
