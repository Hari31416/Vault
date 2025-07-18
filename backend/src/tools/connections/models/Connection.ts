import mongoose, { Document, Schema } from "mongoose";

export interface IConnection extends Document {
  name: string;
  email?: string;
  phone?: string;
  linkedinUsername?: string;
  githubUsername?: string;
  notes?: string;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ConnectionSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    linkedinUsername: {
      type: String,
      trim: true,
    },
    githubUsername: {
      type: String,
      trim: true,
    },
    notes: {
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
ConnectionSchema.index({
  name: "text",
  email: "text",
  phone: "text",
  linkedinUsername: "text",
  githubUsername: "text",
  notes: "text",
});

export default mongoose.model<IConnection>("Connection", ConnectionSchema);
