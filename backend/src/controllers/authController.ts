import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { AuthRequest, JWTPayload } from "../types";

// Generate JWT token
const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
};

// Register user
const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      res.status(400).json({
        success: false,
        message: "Please provide username, email, and password",
      });
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      res.status(400).json({
        success: false,
        message: "User with this email or username already exists",
      });
      return;
    }

    // Check if this is the first user (make them admin)
    const userCount = await User.countDocuments();
    const role = userCount === 0 ? "admin" : "user";

    // Create new user
    const user = new User({
      username,
      email,
      password,
      role,
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id as string);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: (error as Error).message,
    });
  }
};

// Login user
const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
      return;
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
      return;
    }

    // Check password
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
      return;
    }

    // Generate token
    const token = generateToken(user._id as string);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: (error as Error).message,
    });
  }
};

// Create new user (Admin only)
const createNewUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password, role = "user" } = req.body;

    // Validate input
    if (!username || !email || !password) {
      res.status(400).json({
        success: false,
        message: "Please provide username, email, and password",
      });
      return;
    }

    // Validate role
    if (!["user", "admin"].includes(role)) {
      res.status(400).json({
        success: false,
        message: 'Invalid role. Must be either "user" or "admin"',
      });
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      res.status(400).json({
        success: false,
        message: "User with this email or username already exists",
      });
      return;
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      role,
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "User creation failed",
      error: (error as Error).message,
    });
  }
};

// Get current user
const getCurrentUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: {
        user: {
          id: req.user?._id,
          username: req.user?.username,
          email: req.user?.email,
          role: req.user?.role,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get user",
      error: (error as Error).message,
    });
  }
};

// Check if any users exist in the database
const checkUsersExist = async (req: Request, res: Response): Promise<void> => {
  try {
    const userCount = await User.countDocuments();
    res.json({
      success: true,
      hasUsers: userCount > 0,
      count: userCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to check users",
      error: (error as Error).message,
    });
  }
};

export {
  registerUser,
  loginUser,
  createNewUser,
  getCurrentUser,
  checkUsersExist,
};
