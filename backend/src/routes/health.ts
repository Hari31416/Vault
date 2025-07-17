import express from "express";
const router = express.Router();
import {
  getHealthStatus,
  getDetailedHealthStatus,
} from "../controllers/healthController";

// GET /api/health - Basic health check
router.get("/", getHealthStatus);

// GET /api/health/detailed - Detailed health check
router.get("/detailed", getDetailedHealthStatus);

export default router;
