const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Register user
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide username, email, and password",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email or username already exists",
      });
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
    const token = generateToken(user._id);

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
      error: error.message,
    });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check password
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate token
    const token = generateToken(user._id);

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
      error: error.message,
    });
  }
};

// Create new user (Admin only)
const createNewUser = async (req, res) => {
  try {
    const { username, email, password, role = "user" } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide username, email, and password",
      });
    }

    // Validate role
    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be either "user" or "admin"',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email or username already exists",
      });
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
      error: error.message,
    });
  }
};

// Get current user
const getCurrentUser = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: {
        user: {
          id: req.user._id,
          username: req.user.username,
          email: req.user.email,
          role: req.user.role,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get user",
      error: error.message,
    });
  }
};

// Check if any users exist in the database
const checkUsersExist = async (req, res) => {
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
      error: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  createNewUser,
  getCurrentUser,
  checkUsersExist,
};
