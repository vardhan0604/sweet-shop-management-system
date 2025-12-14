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

const router = express.Router();

router.post("/", createSweet);
router.get("/", getAllSweets);
router.get("/search", searchSweets);
router.put("/:id", updateSweet);
router.delete("/:id", deleteSweet);
router.post("/:id/purchase", purchaseSweet);
router.post("/:id/restock", restockSweet);

export default router;
