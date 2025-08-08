import express from "express";
import {
  getRatings,
  getRatingById,
  getRatingsByRestaurant,
  getRatingsByDish,
  createRating,
  updateRating,
  deleteRating,
  getAnalytics,
} from "../controllers/ratingController";
import { authMiddleware } from "../../../middleware/authMiddleware";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Routes
router.get("/", getRatings);
router.get("/analytics", getAnalytics);
router.get("/restaurant/:restaurantId", getRatingsByRestaurant);
router.get("/dish/:dishId", getRatingsByDish);
router.get("/:id", getRatingById);
router.post("/", createRating);
router.put("/:id", updateRating);
router.delete("/:id", deleteRating);

export default router;
