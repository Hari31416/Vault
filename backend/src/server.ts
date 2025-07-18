import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/database";
import authRoutes from "./routes/auth";
import healthRoutes from "./routes/health";
import connectionsToolRoutes from "./tools/connections/routes";

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/tools/connections", connectionsToolRoutes);

// Default route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "My Tools API Server is running!",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      healthDetailed: "/api/health/detailed",
      auth: {
        register: "/api/auth/register",
        login: "/api/auth/login",
        me: "/api/auth/me",
        createUser: "/api/auth/create-user",
      },
      tools: {
        connections: {
          connections: "/api/tools/connections/connections",
          companies: "/api/tools/connections/companies",
          positions: "/api/tools/connections/positions",
        },
      },
    },
  });
});

// Error handling middleware
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
);

// Handle 404
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
