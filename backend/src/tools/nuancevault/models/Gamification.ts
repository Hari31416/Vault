import mongoose, { Schema, Document } from "mongoose";

export interface ISetProgress {
  setId: mongoose.Types.ObjectId;
  attempts: number;
  correct: number;
  streak: number;
  lastAttempt?: Date;
}

export interface IGamification extends Document {
  user: mongoose.Types.ObjectId;
  totalXP: number;
  dailyStreak: number;
  lastPracticeDay?: string; // yyyy-mm-dd
  sets: ISetProgress[];
}

const setProgressSchema = new Schema<ISetProgress>(
  {
    setId: {
      type: Schema.Types.ObjectId,
      ref: "SimilarWordSet",
      required: true,
    },
    attempts: { type: Number, default: 0 },
    correct: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    lastAttempt: { type: Date },
  },
  { _id: false }
);

const gamificationSchema = new Schema<IGamification>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
    },
    totalXP: { type: Number, default: 0 },
    dailyStreak: { type: Number, default: 0 },
    lastPracticeDay: { type: String },
    sets: { type: [setProgressSchema], default: [] },
  },
  { timestamps: true }
);

gamificationSchema.index({ user: 1 });
gamificationSchema.index({ user: 1, "sets.setId": 1 });

export default mongoose.model<IGamification>(
  "NuanceVaultGamification",
  gamificationSchema
);
