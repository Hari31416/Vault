import mongoose from "mongoose";

const similarWordSetSchema = new mongoose.Schema(
  {
    words: {
      type: [String],
      required: true,
      validate: {
        validator: function (arr: string[]) {
          if (!Array.isArray(arr) || arr.length < 2) return false;
          const cleaned = arr.map((w) => (w || "").trim()).filter(Boolean);
          // uniqueness case-insensitive
          const lower = cleaned.map((w) => w.toLowerCase());
          const unique = new Set(lower);
          return (
            cleaned.length === arr.length && // no empty after trim
            unique.size === lower.length // all unique
          );
        },
        message:
          "Words must be >=2, non-empty, trimmed, and unique (case-insensitive)",
      },
    },
    definition: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 300,
      trim: true,
    },
    subtleDifference: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 400,
      trim: true,
    },
    exampleSentences: {
      type: [String],
      required: true,
      validate: {
        validator: function (arr: string[]) {
          if (!Array.isArray(arr) || arr.length < 1 || arr.length > 5)
            return false;
          return arr.every(
            (s) =>
              typeof s === "string" && s.trim().length > 0 && s.length <= 140
          );
        },
        message:
          "Example sentences must be between 1 and 5 items, each 1-140 chars",
      },
    },
  },
  { timestamps: true }
);

// Search index across words & definition for quick filtering
similarWordSetSchema.index({ words: 1 });
similarWordSetSchema.index({ definition: "text", subtleDifference: "text" });

export default mongoose.model("SimilarWordSet", similarWordSetSchema);
