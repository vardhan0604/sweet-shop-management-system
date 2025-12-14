import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import dotenv from "dotenv";

dotenv.config();

beforeAll(async () => {
  await connectDB();
}, 20000); // increase timeout for DB startup

afterAll(async () => {
  await mongoose.connection.close();
});
