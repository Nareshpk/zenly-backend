import mongoose, { Document, Schema, Model } from "mongoose";

/* ------------------ INTERFACE ------------------ */
export interface IUserProfile extends Document {
  userId: mongoose.Types.ObjectId;

  age?: number;
  sex?: "Male" | "Female" | "Other" | string;
  bloodGroup?: "A+" | "A-" | "B+" | "B-" | "O+" | "O-" | "AB+" | "AB-" | string;
  address?: string;
  avatar?: string;

  createdAt?: Date;
  updatedAt?: Date;
}

/* ------------------ SCHEMA ------------------ */
const UserProfileSchema = new Schema<IUserProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one profile per user
      index: true,
    },

    age: {
      type: Number,
      min: 0,
    },

    sex: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },

    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
    },

    address: {
      type: String,
      trim: true,
    },

    avatar: {
      type: String, // image URL or cloudinary path
    },
  },
  { timestamps: true }
);

/* ------------------ MODEL ------------------ */
const UserProfile: Model<IUserProfile> =
  mongoose.models.UserProfile ||
  mongoose.model<IUserProfile>("UserProfile", UserProfileSchema);

export default UserProfile;
