import mongoose, { Document, Schema } from "mongoose";

export interface IPosition extends Document {
  connectionId: mongoose.Types.ObjectId;
  companyId: mongoose.Types.ObjectId;
  title: string;
  startDate?: Date;
  endDate?: Date;
  isCurrent: boolean;
  notes?: string;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PositionSchema: Schema = new Schema(
  {
    connectionId: {
      type: Schema.Types.ObjectId,
      ref: "Connection",
      required: true,
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    isCurrent: {
      type: Boolean,
      default: false,
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

// Ensure that if isCurrent is true, endDate should be null
PositionSchema.pre("save", function (next) {
  if (this.isCurrent) {
    this.endDate = undefined;
  }
  next();
});

// Transform ObjectIds to strings for JSON serialization
PositionSchema.set("toJSON", {
  transform: function (doc, ret) {
    ret.connectionId = ret.connectionId.toString();
    ret.companyId = ret.companyId.toString();
    ret.userId = ret.userId.toString();
    return ret;
  },
});

export default mongoose.model<IPosition>("Position", PositionSchema);
