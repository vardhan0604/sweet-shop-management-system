import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import dotenv from "dotenv";
import Sweet from "../models/Sweet.js";

dotenv.config();

beforeAll(async () => {
  await connectDB();
}, 20000);

// Clear Sweet collection before EVERY test
beforeEach(async () => {
  await Sweet.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});
