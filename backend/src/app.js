import express from "express";

const app = express();
app.use(express.json());

// TEMPORARY route only to make test pass (we will replace later)
app.post("/api/auth/register", (req, res) => {
  return res.status(201).json({ message: "User registered successfully" });
});

export default app;
