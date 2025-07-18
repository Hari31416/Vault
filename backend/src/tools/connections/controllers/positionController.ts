import { Request, Response } from "express";
import Position from "../models/Position";
import Connection from "../models/Connection";
import Company from "../models/Company";
import { AuthRequest } from "../../../types";

// Get all positions for the authenticated user
export const getPositions = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const positions = await Position.find({ userId: req.user!.id })
      .populate("connectionId", "name")
      .populate("companyId", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: positions,
    });
  } catch (error) {
    console.error("Error fetching positions:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch positions",
    });
  }
};

// Get a single position by ID
export const getPositionById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const position = await Position.findOne({ _id: id, userId: req.user!.id })
      .populate("connectionId", "name")
      .populate("companyId", "name");

    if (!position) {
      res.status(404).json({
        success: false,
        message: "Position not found",
      });
      return;
    }

    res.json({
      success: true,
      data: position,
    });
  } catch (error) {
    console.error("Error fetching position:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch position",
    });
  }
};

// Get positions by connection ID
export const getPositionsByConnection = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { connectionId } = req.params;

    // Verify connection belongs to user
    const connection = await Connection.findOne({
      _id: connectionId,
      userId: req.user!.id,
    });
    if (!connection) {
      res.status(404).json({
        success: false,
        message: "Connection not found",
      });
      return;
    }

    const positions = await Position.find({
      connectionId,
      userId: req.user!.id,
    })
      .populate("companyId", "name")
      .sort({ startDate: -1 });

    res.json({
      success: true,
      data: positions,
    });
  } catch (error) {
    console.error("Error fetching positions by connection:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch positions",
    });
  }
};

// Get positions by company ID
export const getPositionsByCompany = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { companyId } = req.params;

    // Verify company belongs to user
    const company = await Company.findOne({
      _id: companyId,
      userId: req.user!.id,
    });
    if (!company) {
      res.status(404).json({
        success: false,
        message: "Company not found",
      });
      return;
    }

    const positions = await Position.find({ companyId, userId: req.user!.id })
      .populate("connectionId", "name")
      .sort({ startDate: -1 });

    res.json({
      success: true,
      data: positions,
    });
  } catch (error) {
    console.error("Error fetching positions by company:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch positions",
    });
  }
};

// Create a new position
export const createPosition = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      connectionId,
      companyId,
      title,
      startDate,
      endDate,
      isCurrent,
      notes,
    } = req.body;

    if (!connectionId || !companyId || !title?.trim()) {
      res.status(400).json({
        success: false,
        message: "Connection, company, and title are required",
      });
      return;
    }

    // Verify connection and company belong to user
    const [connection, company] = await Promise.all([
      Connection.findOne({ _id: connectionId, userId: req.user!.id }),
      Company.findOne({ _id: companyId, userId: req.user!.id }),
    ]);

    if (!connection) {
      res.status(404).json({
        success: false,
        message: "Connection not found",
      });
      return;
    }

    if (!company) {
      res.status(404).json({
        success: false,
        message: "Company not found",
      });
      return;
    }

    const position = new Position({
      connectionId,
      companyId,
      title,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate && !isCurrent ? new Date(endDate) : undefined,
      isCurrent: Boolean(isCurrent),
      notes,
      userId: req.user!.id,
    });

    await position.save();

    const populatedPosition = await Position.findById(position._id)
      .populate("connectionId", "name")
      .populate("companyId", "name");

    res.status(201).json({
      success: true,
      data: populatedPosition,
    });
  } catch (error) {
    console.error("Error creating position:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create position",
    });
  }
};

// Update a position
export const updatePosition = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      connectionId,
      companyId,
      title,
      startDate,
      endDate,
      isCurrent,
      notes,
    } = req.body;

    if (!connectionId || !companyId || !title?.trim()) {
      res.status(400).json({
        success: false,
        message: "Connection, company, and title are required",
      });
      return;
    }

    // Verify connection and company belong to user
    const [connection, company] = await Promise.all([
      Connection.findOne({ _id: connectionId, userId: req.user!.id }),
      Company.findOne({ _id: companyId, userId: req.user!.id }),
    ]);

    if (!connection) {
      res.status(404).json({
        success: false,
        message: "Connection not found",
      });
      return;
    }

    if (!company) {
      res.status(404).json({
        success: false,
        message: "Company not found",
      });
      return;
    }

    const updateData = {
      connectionId,
      companyId,
      title,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate && !isCurrent ? new Date(endDate) : undefined,
      isCurrent: Boolean(isCurrent),
      notes,
    };

    const position = await Position.findOneAndUpdate(
      { _id: id, userId: req.user!.id },
      updateData,
      { new: true, runValidators: true }
    )
      .populate("connectionId", "name")
      .populate("companyId", "name");

    if (!position) {
      res.status(404).json({
        success: false,
        message: "Position not found",
      });
      return;
    }

    res.json({
      success: true,
      data: position,
    });
  } catch (error) {
    console.error("Error updating position:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update position",
    });
  }
};

// Delete a position
export const deletePosition = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const position = await Position.findOneAndDelete({
      _id: id,
      userId: req.user!.id,
    });

    if (!position) {
      res.status(404).json({
        success: false,
        message: "Position not found",
      });
      return;
    }

    res.json({
      success: true,
      message: "Position deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting position:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete position",
    });
  }
};
