import mongoose from "mongoose";

const dishSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
      enum: [
        "Appetizer",
        "Soup",
        "Salad",
        "Main Course",
        "Side Dish",
        "Dessert",
        "Beverage",
        "Other",
      ],
      default: "Other",
    },
    price: {
      type: Number,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
dishSchema.index({ userId: 1, restaurantId: 1, name: 1 });

export default mongoose.model("Dish", dishSchema);
