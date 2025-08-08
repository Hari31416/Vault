import { Request, Response } from "express";
import Restaurant from "../models/Restaurant";
import { AuthRequest } from "../../../types";

// Get all restaurants for the authenticated user
export const getRestaurants = async (req: AuthRequest, res: Response) => {
  try {
    const restaurants = await Restaurant.find({ userId: req.user!.id })
      .sort({ name: 1 })
      .lean();

    res.json({
      success: true,
      data: restaurants,
    });
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching restaurants",
    });
  }
};

// Get restaurant by ID
export const getRestaurantById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findOne({
      _id: id,
      userId: req.user!.id,
    }).lean();

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    return res.json({
      success: true,
      data: restaurant,
    });
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching restaurant",
    });
  }
};

// Create new restaurant
export const createRestaurant = async (req: AuthRequest, res: Response) => {
  try {
    const restaurantData = {
      ...req.body,
      userId: req.user!.id,
    };

    const restaurant = new Restaurant(restaurantData);
    await restaurant.save();

    res.status(201).json({
      success: true,
      data: restaurant,
      message: "Restaurant created successfully",
    });
  } catch (error) {
    console.error("Error creating restaurant:", error);
    res.status(500).json({
      success: false,
      message: "Error creating restaurant",
    });
  }
};

// Update restaurant
export const updateRestaurant = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findOneAndUpdate(
      { _id: id, userId: req.user!.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    return res.json({
      success: true,
      data: restaurant,
      message: "Restaurant updated successfully",
    });
  } catch (error) {
    console.error("Error updating restaurant:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating restaurant",
    });
  }
};

// Delete restaurant
export const deleteRestaurant = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findOneAndDelete({
      _id: id,
      userId: req.user!.id,
    });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    return res.json({
      success: true,
      message: "Restaurant deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting restaurant:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting restaurant",
    });
  }
};

// Search restaurants
export const searchRestaurants = async (req: AuthRequest, res: Response) => {
  try {
    const { q } = req.query;

    if (!q || typeof q !== "string") {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const restaurants = await Restaurant.find({
      userId: req.user!.id,
      $or: [
        { name: { $regex: q, $options: "i" } },
        { cuisine: { $regex: q, $options: "i" } },
        { address: { $regex: q, $options: "i" } },
      ],
    })
      .sort({ name: 1 })
      .lean();

    return res.json({
      success: true,
      data: restaurants,
    });
  } catch (error) {
    console.error("Error searching restaurants:", error);
    return res.status(500).json({
      success: false,
      message: "Error searching restaurants",
    });
  }
};
