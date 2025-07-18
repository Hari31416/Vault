import mongoose, { Document, Schema } from "mongoose";

export interface ICompany extends Document {
  name: string;
  industry?: string;
  website?: string;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CompanySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    industry: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for search functionality
CompanySchema.index({
  name: "text",
  industry: "text",
  website: "text",
});

export default mongoose.model<ICompany>("Company", CompanySchema);
