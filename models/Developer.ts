import mongoose, { Document, Schema } from "mongoose";

export interface IDeveloper extends Document {
  name: string;
  role: string;
  bio: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const developerSchema = new Schema<IDeveloper>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      required: true,
      trim: true,
    },

    bio: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Developer =
  mongoose.models.Developer ||
  mongoose.model<IDeveloper>("Developer", developerSchema);

export default Developer;