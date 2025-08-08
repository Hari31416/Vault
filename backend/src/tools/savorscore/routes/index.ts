import express from "express";
import restaurantRoutes from "./restaurants";
import dishRoutes from "./dishes";
import ratingRoutes from "./ratings";

const router = express.Router();

// Mount individual route modules
router.use("/restaurants", restaurantRoutes);
router.use("/dishes", dishRoutes);
router.use("/ratings", ratingRoutes);

export default router;
