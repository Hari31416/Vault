import express from "express";
import {
  getDishes,
  getDishById,
  getDishesByRestaurant,
  createDish,
  updateDish,
  deleteDish,
  searchDishes,
} from "../controllers/dishController";
import { authMiddleware } from "../../../middleware/authMiddleware";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Routes
router.get("/", getDishes);
router.get("/search", searchDishes);
router.get("/restaurant/:restaurantId", getDishesByRestaurant);
router.get("/:id", getDishById);
router.post("/", createDish);
router.put("/:id", updateDish);
router.delete("/:id", deleteDish);

export default router;
