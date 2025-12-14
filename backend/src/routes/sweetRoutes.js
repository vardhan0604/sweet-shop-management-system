import express from "express";
import {
  createSweet,
  getAllSweets,
  searchSweets,
  updateSweet
} from "../controllers/sweetController.js";

const router = express.Router();

router.post("/", createSweet);
router.get("/", getAllSweets);
router.get("/search", searchSweets);
router.put("/:id", updateSweet);

export default router;
