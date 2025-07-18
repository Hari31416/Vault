import { Request, Response } from "express";
import Connection from "../models/Connection";
import { AuthRequest } from "../../../types";

// Get all connections for the authenticated user
export const getConnections = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const connections = await Connection.find({ userId: req.user!.id }).sort({
      createdAt: -1,
    });
    res.json({
      success: true,
      data: connections,
    });
  } catch (error) {
    console.error("Error fetching connections:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch connections",
    });
  }
};

// Get a single connection by ID
export const getConnectionById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const connection = await Connection.findOne({
      _id: id,
      userId: req.user!.id,
    });

    if (!connection) {
      res.status(404).json({
        success: false,
        message: "Connection not found",
      });
      return;
    }

    res.json({
      success: true,
      data: connection,
    });
  } catch (error) {
    console.error("Error fetching connection:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch connection",
    });
  }
};

// Create a new connection
export const createConnection = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { name, email, phone, linkedinUsername, githubUsername, notes } =
      req.body;

    if (!name?.trim()) {
      res.status(400).json({
        success: false,
        message: "Name is required",
      });
      return;
    }

    const connection = new Connection({
      name,
      email,
      phone,
      linkedinUsername,
      githubUsername,
      notes,
      userId: req.user!.id,
    });

    await connection.save();

    res.status(201).json({
      success: true,
      data: connection,
    });
  } catch (error) {
    console.error("Error creating connection:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create connection",
    });
  }
};

// Update a connection
export const updateConnection = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, email, phone, linkedinUsername, githubUsername, notes } =
      req.body;

    if (!name?.trim()) {
      res.status(400).json({
        success: false,
        message: "Name is required",
      });
      return;
    }

    const connection = await Connection.findOneAndUpdate(
      { _id: id, userId: req.user!.id },
      { name, email, phone, linkedinUsername, githubUsername, notes },
      { new: true, runValidators: true }
    );

    if (!connection) {
      res.status(404).json({
        success: false,
        message: "Connection not found",
      });
      return;
    }

    res.json({
      success: true,
      data: connection,
    });
  } catch (error) {
    console.error("Error updating connection:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update connection",
    });
  }
};

// Delete a connection
export const deleteConnection = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const connection = await Connection.findOne({
      _id: id,
      userId: req.user!.id,
    });

    if (!connection) {
      res.status(404).json({
        success: false,
        message: "Connection not found",
      });
      return;
    }

    // Delete all positions associated with this connection
    const Position = require("../models/Position").default;
    await Position.deleteMany({ connectionId: id, userId: req.user!.id });

    // Delete the connection
    await Connection.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Connection and associated positions deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting connection:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete connection",
    });
  }
};

// Search connections
export const searchConnections = async (
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

    const connections = await Connection.find({
      userId: req.user!.id,
      $text: { $search: q },
    }).sort({ score: { $meta: "textScore" }, createdAt: -1 });

    res.json({
      success: true,
      data: connections,
    });
  } catch (error) {
    console.error("Error searching connections:", error);
    res.status(500).json({
      success: false,
      message: "Failed to search connections",
    });
  }
};
