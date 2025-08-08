import { Request, Response } from "express";
import Dish from "../models/Dish";
import { AuthRequest } from "../../../types";

// Get all dishes for the authenticated user
export const getDishes = async (req: AuthRequest, res: Response) => {
  try {
    const dishes = await Dish.find({ userId: req.user!.id })
      .populate({
        path: "restaurantId",
        select: "name",
        options: { strictPopulate: false },
      })
      .sort({ name: 1 })
      .lean();

    // Map restaurant name
    const mapped = dishes.map((d: any) => ({
      ...d,
      restaurantName: d.restaurantId?.name,
      restaurantId: d.restaurantId?._id ? d.restaurantId._id : d.restaurantId, // preserve id if populated or raw
    }));

    res.json({
      success: true,
      data: mapped,
    });
  } catch (error) {
    console.error("Error fetching dishes:", error);
    res.status(500).json({ success: false, message: "Error fetching dishes" });
  }
};

// Get dish by ID
export const getDishById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const dish: any = await Dish.findOne({ _id: id, userId: req.user!.id })
      .populate({
        path: "restaurantId",
        select: "name",
        options: { strictPopulate: false },
      })
      .lean();

    if (!dish) {
      return res
        .status(404)
        .json({ success: false, message: "Dish not found" });
    }

    dish.restaurantName = dish.restaurantId?.name;
    dish.restaurantId = dish.restaurantId?._id
      ? dish.restaurantId._id
      : dish.restaurantId;

    return res.json({ success: true, data: dish });
  } catch (error) {
    console.error("Error fetching dish:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error fetching dish" });
  }
};

// Get dishes by restaurant
export const getDishesByRestaurant = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { restaurantId } = req.params;
    const dishes = await Dish.find({ restaurantId, userId: req.user!.id })
      .sort({ name: 1 })
      .lean();

    res.json({ success: true, data: dishes });
  } catch (error) {
    console.error("Error fetching dishes by restaurant:", error);
    res.status(500).json({ success: false, message: "Error fetching dishes" });
  }
};

// Create new dish
export const createDish = async (req: AuthRequest, res: Response) => {
  try {
    const dishData = { ...req.body, userId: req.user!.id };

    const dish: any = new Dish(dishData);
    await dish.save();

    const populated = await Dish.findById(dish._id)
      .populate({
        path: "restaurantId",
        select: "name",
        options: { strictPopulate: false },
      })
      .lean();

    const responseDish: any = populated || dish.toObject();
    if (responseDish.restaurantId?.name) {
      responseDish.restaurantName = responseDish.restaurantId.name;
      responseDish.restaurantId = responseDish.restaurantId._id;
    }

    res.status(201).json({
      success: true,
      data: responseDish,
      message: "Dish created successfully",
    });
  } catch (error) {
    console.error("Error creating dish:", error);
    res.status(500).json({ success: false, message: "Error creating dish" });
  }
};

// Update dish
export const updateDish = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const dish: any = await Dish.findOneAndUpdate(
      { _id: id, userId: req.user!.id },
      req.body,
      { new: true, runValidators: true }
    ).populate({
      path: "restaurantId",
      select: "name",
      options: { strictPopulate: false },
    });

    if (!dish) {
      return res
        .status(404)
        .json({ success: false, message: "Dish not found" });
    }

    const responseDish: any = dish.toObject();
    if (responseDish.restaurantId?.name) {
      responseDish.restaurantName = responseDish.restaurantId.name;
      responseDish.restaurantId = responseDish.restaurantId._id;
    }

    return res.json({
      success: true,
      data: responseDish,
      message: "Dish updated successfully",
    });
  } catch (error) {
    console.error("Error updating dish:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error updating dish" });
  }
};

// Delete dish
export const deleteDish = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const dish = await Dish.findOneAndDelete({ _id: id, userId: req.user!.id });

    if (!dish) {
      return res
        .status(404)
        .json({ success: false, message: "Dish not found" });
    }

    return res.json({ success: true, message: "Dish deleted successfully" });
  } catch (error) {
    console.error("Error deleting dish:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error deleting dish" });
  }
};

// Search dishes
export const searchDishes = async (req: AuthRequest, res: Response) => {
  try {
    const { q } = req.query;

    if (!q || typeof q !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "Search query is required" });
    }

    const dishes = await Dish.find({
      userId: req.user!.id,
      $or: [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
      ],
    })
      .populate({
        path: "restaurantId",
        select: "name",
        options: { strictPopulate: false },
      })
      .sort({ name: 1 })
      .lean();

    const mapped = dishes.map((d: any) => ({
      ...d,
      restaurantName: d.restaurantId?.name,
      restaurantId: d.restaurantId?._id ? d.restaurantId._id : d.restaurantId,
    }));

    return res.json({ success: true, data: mapped });
  } catch (error) {
    console.error("Error searching dishes:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error searching dishes" });
  }
};
