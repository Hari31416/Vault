import express from "express";
import { authMiddleware } from "../../../middleware/authMiddleware";
import {
  getGamification,
  recordPractice,
  resetGamification,
} from "../controllers/gamificationController";

const router = express.Router();

router.get("/gamification", authMiddleware, getGamification);
router.post("/gamification/practice", authMiddleware, recordPractice);
router.post("/gamification/reset", authMiddleware, resetGamification);

export default router;
