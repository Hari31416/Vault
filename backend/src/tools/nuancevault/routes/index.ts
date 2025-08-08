import express from "express";
import groupsRoutes from "./groups";

const router = express.Router();

router.use("/", groupsRoutes);

export default router;
