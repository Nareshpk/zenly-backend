import mongoose, { Schema, Document } from "mongoose";

export interface ISpecialization extends Document {
  name: string;
  description?: string;
  department?: string;
  isActive: boolean;
}

const SpecializationSchema = new Schema<ISpecialization>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    department: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<ISpecialization>(
  "Specialization",
  SpecializationSchema
);
