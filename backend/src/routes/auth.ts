import express from "express";
const router = express.Router();
import {
  registerUser,
  loginUser,
  createNewUser,
  getCurrentUser,
  checkUsersExist,
} from "../controllers/authController";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware";

// POST /api/auth/register - User registration
router.post("/register", registerUser);

// POST /api/auth/login - User login
router.post("/login", loginUser);

// GET /api/auth/me - Get current user (protected)
router.get("/me", authMiddleware, getCurrentUser);

// GET /api/auth/users-exist - Check if any users exist (public)
router.get("/users-exist", checkUsersExist);

// POST /api/auth/create-user - Create new user (admin only)
router.post("/create-user", authMiddleware, adminMiddleware, createNewUser);

export default router;
