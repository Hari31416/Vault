import express from "express";
import groupsRoutes from "./groups";
import gamificationRoutes from "./gamification";

const router = express.Router();

router.use("/", groupsRoutes);
router.use("/", gamificationRoutes);

export default router;
