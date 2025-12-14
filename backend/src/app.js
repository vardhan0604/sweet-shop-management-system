import express from "express";
import authRoutes from "./routes/authRoutes.js";
import sweetRoutes from "./routes/sweetRoutes.js";
import cors from "cors";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/sweets", sweetRoutes);

export default app;
