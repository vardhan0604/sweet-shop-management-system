import express from "express";
import { createSweet, getAllSweets, searchSweets } from "../controllers/sweetController.js";

const router = express.Router();

router.post("/", createSweet);
router.get("/", getAllSweets);
router.get("/search", searchSweets);

export default router;
