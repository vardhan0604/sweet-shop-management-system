import express from "express";
import { createSweet, getAllSweets } from "../controllers/sweetController.js";

const router = express.Router();

router.post("/", createSweet);
router.get("/", getAllSweets);

export default router;
