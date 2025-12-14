import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import dotenv from "dotenv";
import Sweet from "../models/Sweet.js";
import User from "../models/User.js";

dotenv.config();

beforeAll(async () => {
  await connectDB();
}, 20000);

beforeEach(async () => {
  await Sweet.deleteMany({});
  await User.deleteMany({});  
});

afterAll(async () => {
  await mongoose.connection.close();
});
