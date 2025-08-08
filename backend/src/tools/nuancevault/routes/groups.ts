import express from "express";
import {
  listGroups,
  getGroup,
  createGroup,
  updateGroup,
  deleteGroup,
  importGroups,
  exportGroups,
} from "../controllers/similarWordSetController";
import {
  authMiddleware,
  adminMiddleware,
} from "../../../middleware/authMiddleware";

const router = express.Router();

// All routes protected by auth, but data is global (no user scoping in controller/model)
router.get("/groups", authMiddleware, listGroups);
router.get("/groups/:id", authMiddleware, getGroup);
router.post("/groups", authMiddleware, createGroup);
router.put("/groups/:id", authMiddleware, updateGroup);
router.delete("/groups/:id", authMiddleware, deleteGroup);
// Import restricted to admins
router.post("/import", authMiddleware, adminMiddleware, importGroups);
router.get("/export", authMiddleware, exportGroups);

export default router;
