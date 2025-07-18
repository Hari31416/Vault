import { Request, Response } from "express";
import Company from "../models/Company";
import { AuthRequest } from "../../../types";

// Get all companies for the authenticated user
export const getCompanies = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const companies = await Company.find({ userId: req.user!.id }).sort({
      createdAt: -1,
    });
    res.json({
      success: true,
      data: companies,
    });
  } catch (error) {
    console.error("Error fetching companies:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch companies",
    });
  }
};

// Get a single company by ID
export const getCompanyById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const company = await Company.findOne({ _id: id, userId: req.user!.id });

    if (!company) {
      res.status(404).json({
        success: false,
        message: "Company not found",
      });
      return;
    }

    res.json({
      success: true,
      data: company,
    });
  } catch (error) {
    console.error("Error fetching company:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch company",
    });
  }
};

// Create a new company
export const createCompany = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { name, industry, website } = req.body;

    if (!name?.trim()) {
      res.status(400).json({
        success: false,
        message: "Company name is required",
      });
      return;
    }

    const company = new Company({
      name,
      industry,
      website,
      userId: req.user!.id,
    });

    await company.save();

    res.status(201).json({
      success: true,
      data: company,
    });
  } catch (error) {
    console.error("Error creating company:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create company",
    });
  }
};

// Update a company
export const updateCompany = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, industry, website } = req.body;

    if (!name?.trim()) {
      res.status(400).json({
        success: false,
        message: "Company name is required",
      });
      return;
    }

    const company = await Company.findOneAndUpdate(
      { _id: id, userId: req.user!.id },
      { name, industry, website },
      { new: true, runValidators: true }
    );

    if (!company) {
      res.status(404).json({
        success: false,
        message: "Company not found",
      });
      return;
    }

    res.json({
      success: true,
      data: company,
    });
  } catch (error) {
    console.error("Error updating company:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update company",
    });
  }
};

// Delete a company
export const deleteCompany = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const company = await Company.findOneAndDelete({
      _id: id,
      userId: req.user!.id,
    });

    if (!company) {
      res.status(404).json({
        success: false,
        message: "Company not found",
      });
      return;
    }

    res.json({
      success: true,
      message: "Company deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting company:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete company",
    });
  }
};

// Search companies
export const searchCompanies = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { q } = req.query;

    if (!q || typeof q !== "string") {
      res.status(400).json({
        success: false,
        message: "Search query is required",
      });
      return;
    }

    const companies = await Company.find({
      userId: req.user!.id,
      $text: { $search: q },
    }).sort({ score: { $meta: "textScore" }, createdAt: -1 });

    res.json({
      success: true,
      data: companies,
    });
  } catch (error) {
    console.error("Error searching companies:", error);
    res.status(500).json({
      success: false,
      message: "Failed to search companies",
    });
  }
};
