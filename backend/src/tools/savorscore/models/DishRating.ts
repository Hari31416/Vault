import mongoose from "mongoose";

const dishRatingSchema = new mongoose.Schema(
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
    dishId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dish",
      required: true,
    },
    // Six detailed criteria ratings (1-5)
    overallFlavor: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    ingredientQuality: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    textureAndMouthfeel: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    executionAndCraftsmanship: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    valueForMoney: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    cravingAndReorderLikelihood: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    // Calculated average score
    averageScore: {
      type: Number,
      min: 1,
      max: 5,
    },
    dateVisited: {
      type: Date,
      required: true,
      default: Date.now,
    },
    notes: {
      type: String,
      trim: true,
    },
    wouldOrderAgain: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to calculate average score
dishRatingSchema.pre("save", function (next) {
  const rating = this as any;
  rating.averageScore = (
    (rating.overallFlavor +
      rating.ingredientQuality +
      rating.textureAndMouthfeel +
      rating.executionAndCraftsmanship +
      rating.valueForMoney +
      rating.cravingAndReorderLikelihood) /
    6
  ).toFixed(1);
  next();
});

// Index for better query performance
dishRatingSchema.index({ userId: 1, restaurantId: 1, dishId: 1 });
dishRatingSchema.index({ userId: 1, dateVisited: -1 });

export default mongoose.model("DishRating", dishRatingSchema);
