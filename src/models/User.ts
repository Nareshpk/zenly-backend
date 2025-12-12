import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  name: string;
  email: string;
  username?: string;
  phone?: string;
  role: "user" | "doctor" | "admin" | string;
  password: string;
  agree?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    role: { type: String, default: "user" },
    password: { type: String, required: true },
    agree: { type: Boolean, default: false },
    username: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);


const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User;
