import express from "express";
import connectionsRoutes from "./connections";
import companiesRoutes from "./companies";
import positionsRoutes from "./positions";

const router = express.Router();

// Mount individual route modules
router.use("/connections", connectionsRoutes);
router.use("/companies", companiesRoutes);
router.use("/positions", positionsRoutes);

export default router;
