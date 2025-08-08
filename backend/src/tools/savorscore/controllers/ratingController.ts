import { Request, Response } from "express";
import DishRating from "../models/DishRating";
import { AuthRequest } from "../../../types";

// Get all ratings for the authenticated user
export const getRatings = async (req: AuthRequest, res: Response) => {
  try {
    const ratings = await DishRating.find({ userId: req.user!.id })
      .populate("restaurantId", "name")
      .populate("dishId", "name")
      .sort({ dateVisited: -1 })
      .lean();

    res.json({
      success: true,
      data: ratings,
    });
  } catch (error) {
    console.error("Error fetching ratings:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching ratings",
    });
  }
};

// Get rating by ID
export const getRatingById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const rating = await DishRating.findOne({
      _id: id,
      userId: req.user!.id,
    })
      .populate("restaurantId", "name")
      .populate("dishId", "name")
      .lean();

    if (!rating) {
      return res.status(404).json({
        success: false,
        message: "Rating not found",
      });
    }

    return res.json({
      success: true,
      data: rating,
    });
  } catch (error) {
    console.error("Error fetching rating:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching rating",
    });
  }
};

// Get ratings by restaurant
export const getRatingsByRestaurant = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { restaurantId } = req.params;
    const ratings = await DishRating.find({
      restaurantId,
      userId: req.user!.id,
    })
      .populate("dishId", "name")
      .sort({ dateVisited: -1 })
      .lean();

    res.json({
      success: true,
      data: ratings,
    });
  } catch (error) {
    console.error("Error fetching ratings by restaurant:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching ratings",
    });
  }
};

// Get ratings by dish
export const getRatingsByDish = async (req: AuthRequest, res: Response) => {
  try {
    const { dishId } = req.params;
    const ratings = await DishRating.find({
      dishId,
      userId: req.user!.id,
    })
      .populate("restaurantId", "name")
      .sort({ dateVisited: -1 })
      .lean();

    res.json({
      success: true,
      data: ratings,
    });
  } catch (error) {
    console.error("Error fetching ratings by dish:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching ratings",
    });
  }
};

// Create new rating
export const createRating = async (req: AuthRequest, res: Response) => {
  try {
    const ratingData = {
      ...req.body,
      userId: req.user!.id,
    };

    const rating = new DishRating(ratingData);
    await rating.save();

    // Populate data for response
    const populatedRating = await DishRating.findById(rating._id)
      .populate("restaurantId", "name")
      .populate("dishId", "name")
      .lean();

    res.status(201).json({
      success: true,
      data: populatedRating,
      message: "Rating created successfully",
    });
  } catch (error) {
    console.error("Error creating rating:", error);
    res.status(500).json({
      success: false,
      message: "Error creating rating",
    });
  }
};

// Update rating
export const updateRating = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const rating = await DishRating.findOneAndUpdate(
      { _id: id, userId: req.user!.id },
      req.body,
      { new: true, runValidators: true }
    )
      .populate("restaurantId", "name")
      .populate("dishId", "name");

    if (!rating) {
      return res.status(404).json({
        success: false,
        message: "Rating not found",
      });
    }

    return res.json({
      success: true,
      data: rating,
      message: "Rating updated successfully",
    });
  } catch (error) {
    console.error("Error updating rating:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating rating",
    });
  }
};

// Delete rating
export const deleteRating = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const rating = await DishRating.findOneAndDelete({
      _id: id,
      userId: req.user!.id,
    });

    if (!rating) {
      return res.status(404).json({
        success: false,
        message: "Rating not found",
      });
    }

    return res.json({
      success: true,
      message: "Rating deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting rating:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting rating",
    });
  }
};

// Get analytics
export const getAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    // Get total counts
    const totalRatings = await DishRating.countDocuments({ userId });

    // Get average scores by restaurant
    const restaurantAverages = await DishRating.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: "$restaurantId",
          averageScore: { $avg: "$averageScore" },
          totalRatings: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "restaurants",
          localField: "_id",
          foreignField: "_id",
          as: "restaurant",
        },
      },
      {
        $unwind: "$restaurant",
      },
      {
        $project: {
          restaurantName: "$restaurant.name",
          averageScore: { $round: ["$averageScore", 2] },
          totalRatings: 1,
        },
      },
      { $sort: { averageScore: -1 } },
    ]);

    // Get top rated dishes
    const topDishes = await DishRating.find({ userId })
      .populate("restaurantId", "name")
      .populate("dishId", "name")
      .sort({ averageScore: -1 })
      .limit(10)
      .lean();

    // Get recent ratings
    const recentRatings = await DishRating.find({ userId })
      .populate("restaurantId", "name")
      .populate("dishId", "name")
      .sort({ dateVisited: -1 })
      .limit(10)
      .lean();

    return res.json({
      success: true,
      data: {
        totalRatings,
        restaurantAverages,
        topDishes,
        recentRatings,
      },
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching analytics",
    });
  }
};
