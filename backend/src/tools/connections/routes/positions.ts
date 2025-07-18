import express from "express";
import {
  getPositions,
  getPositionById,
  getPositionsByConnection,
  getPositionsByCompany,
  createPosition,
  updatePosition,
  deletePosition,
} from "../controllers/positionController";
import { authMiddleware } from "../../../middleware/authMiddleware";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Routes
router.get("/", getPositions);
router.get("/connection/:connectionId", getPositionsByConnection);
router.get("/company/:companyId", getPositionsByCompany);
router.get("/:id", getPositionById);
router.post("/", createPosition);
router.put("/:id", updatePosition);
router.delete("/:id", deletePosition);

export default router;
