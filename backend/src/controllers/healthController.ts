import { Request, Response } from "express";
import mongoose from "mongoose";

const getHealthStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    res.status(200).json({
      success: true,
      status: "OK",
      message: "Server is running",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: "ERROR",
      message: "Health check failed",
      error: (error as Error).message,
    });
  }
};

const getDetailedHealthStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const dbStatus =
      mongoose.connection.readyState === 1 ? "Connected" : "Disconnected";
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();

    res.status(200).json({
      success: true,
      status: "OK",
      message: "Detailed health status",
      data: {
        server: {
          status: "Running",
          uptime: `${Math.floor(uptime / 60)} minutes ${Math.floor(
            uptime % 60
          )} seconds`,
          timestamp: new Date().toISOString(),
          nodeVersion: process.version,
          environment: process.env.NODE_ENV || "development",
        },
        database: {
          status: dbStatus,
          connection: mongoose.connection.host || "Unknown",
        },
        memory: {
          rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
          heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
          heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
          external: `${Math.round(memoryUsage.external / 1024 / 1024)} MB`,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: "ERROR",
      message: "Detailed health check failed",
      error: (error as Error).message,
    });
  }
};

export { getHealthStatus, getDetailedHealthStatus };
