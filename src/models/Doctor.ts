// models/Doctor.ts
import mongoose, { Schema, Document } from "mongoose";

export interface ISubDoc { id: string; collapsed?: boolean; }

const MembershipSchema = new Schema({ id: String, title: String, about: String });
const ExperienceSchema = new Schema({
  id: String, title: String, hospital: String, years: String, location: String,
  employment: String, description: String, startDate: String, endDate: String,
  currentlyWorking: Boolean, logo: String, collapsed: Boolean
});
const EducationSchema = new Schema({
  id: String, logo: String, institution: String, course: String,
  startDate: String, endDate: String, years: String, description: String, collapsed: Boolean
});
const AwardSchema = new Schema({ id: String, name: String, year: String, description: String, collapsed: Boolean });
const InsuranceSchema = new Schema({ id: String, idRef: String, logo: String, name: String, collapsed: Boolean });
const ClinicSchema = new Schema({
  id: String, logo: String, name: String, location: String, address: String, gallery: [String], collapsed: Boolean
});
const BusinessHoursSchema = new Schema({ day: String, enabled: Boolean, open: String, close: String, collapsed: Boolean });

export interface IDoctor extends Document {
  firstName?: string;
  lastName?: string;
  displayName?: string;
  designation?: string;
  phone?: string;
  email?: string;
  imageUrl?: string;
  languages: string[];
  memberships: any[];
  experiences: any[];
  education: any[];
  awards: any[];
  insurances: any[];
  clinics: any[];
  businessHours: any[];
  createdAt?: Date;
  updatedAt?: Date;
}

const DoctorSchema = new Schema<IDoctor>({
  firstName: String,
  lastName: String,
  displayName: String,
  designation: String,
  phone: String,
  email: String,
  imageUrl: String,
  languages: [String],
  memberships: [MembershipSchema],
  experiences: [ExperienceSchema],
  education: [EducationSchema],
  awards: [AwardSchema],
  insurances: [InsuranceSchema],
  clinics: [ClinicSchema],
  businessHours: [BusinessHoursSchema],
}, { timestamps: true });

export default mongoose.model<IDoctor>("Doctor", DoctorSchema);
