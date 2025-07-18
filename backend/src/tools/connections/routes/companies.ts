import express from "express";
import {
  getCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany,
  searchCompanies,
} from "../controllers/companyController";
import { authMiddleware } from "../../../middleware/authMiddleware";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Routes
router.get("/", getCompanies);
router.get("/search", searchCompanies);
router.get("/:id", getCompanyById);
router.post("/", createCompany);
router.put("/:id", updateCompany);
router.delete("/:id", deleteCompany);

export default router;
