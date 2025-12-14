import express from "express";
import {
  createSweet,
  getAllSweets,
  searchSweets,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet
} from "../controllers/sweetController.js";

import { auth } from "../middleware/auth.js";
import { adminOnly } from "../middleware/adminOnly.js";

const router = express.Router();

// Admin routes
router.post("/", auth, adminOnly, createSweet);
router.put("/:id", auth, adminOnly, updateSweet);
router.delete("/:id", auth, adminOnly, deleteSweet);
router.post("/:id/restock", auth, adminOnly, restockSweet);

// User routes
router.get("/", auth, getAllSweets);
router.get("/search", auth, searchSweets);
router.post("/:id/purchase", auth, purchaseSweet);

export default router;
