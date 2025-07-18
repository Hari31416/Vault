import express from "express";
import {
  getConnections,
  getConnectionById,
  createConnection,
  updateConnection,
  deleteConnection,
  searchConnections,
} from "../controllers/connectionController";
import { authMiddleware } from "../../../middleware/authMiddleware";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Routes
router.get("/", getConnections);
router.get("/search", searchConnections);
router.get("/:id", getConnectionById);
router.post("/", createConnection);
router.put("/:id", updateConnection);
router.delete("/:id", deleteConnection);

export default router;
