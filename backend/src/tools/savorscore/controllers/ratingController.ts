import { Request, Response } from "express";
import DishRating from "../models/DishRating";
import { AuthRequest } from "../../../types";

// Helper to map populated documents
const mapRating = (r: any) => ({
  ...r,
  restaurantName: r.restaurantId?.name,
  restaurantId: r.restaurantId?._id ? r.restaurantId._id : r.restaurantId,
  dishName: r.dishId?.name,
  dishId: r.dishId?._id ? r.dishId._id : r.dishId,
});

// Get all ratings for the authenticated user
export const getRatings = async (req: AuthRequest, res: Response) => {
  try {
    const rawRatings: any[] = await DishRating.find({ userId: req.user!.id })
      .populate({
        path: "restaurantId",
        select: "name",
        options: { strictPopulate: false },
      })
      .populate({
        path: "dishId",
        select: "name",
        options: { strictPopulate: false },
      })
      .sort({ dateVisited: -1 })
      .lean();

    const ratings = rawRatings.map(mapRating);

    res.json({ success: true, data: ratings });
  } catch (error) {
    console.error("Error fetching ratings:", error);
    res.status(500).json({ success: false, message: "Error fetching ratings" });
  }
};

// Get rating by ID
export const getRatingById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const raw: any = await DishRating.findOne({ _id: id, userId: req.user!.id })
      .populate({
        path: "restaurantId",
        select: "name",
        options: { strictPopulate: false },
      })
      .populate({
        path: "dishId",
        select: "name",
        options: { strictPopulate: false },
      })
      .lean();

    if (!raw) {
      return res
        .status(404)
        .json({ success: false, message: "Rating not found" });
    }

    return res.json({ success: true, data: mapRating(raw) });
  } catch (error) {
    console.error("Error fetching rating:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error fetching rating" });
  }
};

// Get ratings by restaurant
export const getRatingsByRestaurant = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { restaurantId } = req.params;
    const raw: any[] = await DishRating.find({
      restaurantId,
      userId: req.user!.id,
    })
      .populate({
        path: "dishId",
        select: "name",
        options: { strictPopulate: false },
      })
      .sort({ dateVisited: -1 })
      .lean();

    const ratings = raw.map(mapRating);

    res.json({ success: true, data: ratings });
  } catch (error) {
    console.error("Error fetching ratings by restaurant:", error);
    res.status(500).json({ success: false, message: "Error fetching ratings" });
  }
};

// Get ratings by dish
export const getRatingsByDish = async (req: AuthRequest, res: Response) => {
  try {
    const { dishId } = req.params;
    const raw: any[] = await DishRating.find({ dishId, userId: req.user!.id })
      .populate({
        path: "restaurantId",
        select: "name",
        options: { strictPopulate: false },
      })
      .sort({ dateVisited: -1 })
      .lean();

    const ratings = raw.map(mapRating);

    res.json({ success: true, data: ratings });
  } catch (error) {
    console.error("Error fetching ratings by dish:", error);
    res.status(500).json({ success: false, message: "Error fetching ratings" });
  }
};

// Create new rating
export const createRating = async (req: AuthRequest, res: Response) => {
  try {
    const ratingData = { ...req.body, userId: req.user!.id };
    const rating: any = new DishRating(ratingData);
    await rating.save();

    const populated: any = await DishRating.findById(rating._id)
      .populate({
        path: "restaurantId",
        select: "name",
        options: { strictPopulate: false },
      })
      .populate({
        path: "dishId",
        select: "name",
        options: { strictPopulate: false },
      })
      .lean();

    res.status(201).json({
      success: true,
      data: mapRating(populated),
      message: "Rating created successfully",
    });
  } catch (error) {
    console.error("Error creating rating:", error);
    res.status(500).json({ success: false, message: "Error creating rating" });
  }
};

// Update rating
export const updateRating = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const rating: any = await DishRating.findOneAndUpdate(
      { _id: id, userId: req.user!.id },
      req.body,
      { new: true, runValidators: true }
    )
      .populate({
        path: "restaurantId",
        select: "name",
        options: { strictPopulate: false },
      })
      .populate({
        path: "dishId",
        select: "name",
        options: { strictPopulate: false },
      });

    if (!rating) {
      return res
        .status(404)
        .json({ success: false, message: "Rating not found" });
    }

    return res.json({
      success: true,
      data: mapRating(rating.toObject()),
      message: "Rating updated successfully",
    });
  } catch (error) {
    console.error("Error updating rating:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error updating rating" });
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
      return res
        .status(404)
        .json({ success: false, message: "Rating not found" });
    }

    return res.json({ success: true, message: "Rating deleted successfully" });
  } catch (error) {
    console.error("Error deleting rating:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error deleting rating" });
  }
};

// Get analytics
export const getAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const totalRatings = await DishRating.countDocuments({ userId });

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
      { $unwind: "$restaurant" },
      {
        $project: {
          restaurantName: "$restaurant.name",
          averageScore: { $round: ["$averageScore", 2] },
          totalRatings: 1,
        },
      },
      { $sort: { averageScore: -1 } },
    ]);

    const topDishesRaw: any[] = await DishRating.find({ userId })
      .populate({
        path: "restaurantId",
        select: "name",
        options: { strictPopulate: false },
      })
      .populate({
        path: "dishId",
        select: "name",
        options: { strictPopulate: false },
      })
      .sort({ averageScore: -1 })
      .limit(10)
      .lean();
    const topDishes = topDishesRaw.map(mapRating);

    const recentRatingsRaw: any[] = await DishRating.find({ userId })
      .populate({
        path: "restaurantId",
        select: "name",
        options: { strictPopulate: false },
      })
      .populate({
        path: "dishId",
        select: "name",
        options: { strictPopulate: false },
      })
      .sort({ dateVisited: -1 })
      .limit(10)
      .lean();
    const recentRatings = recentRatingsRaw.map(mapRating);

    return res.json({
      success: true,
      data: { totalRatings, restaurantAverages, topDishes, recentRatings },
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error fetching analytics" });
  }
};
