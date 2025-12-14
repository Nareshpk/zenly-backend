// models/Doctor.ts
import mongoose, { Schema, Document } from "mongoose";

export type DayKey =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export interface BusinessDay {
  day: DayKey;
  enabled?: boolean;
  slots?: string[];    // times as strings e.g. "09:00 AM"
  fee?: number | string;
  spaces?: string[];   // optional spaces list
}

export interface ISubDoc { id: string; collapsed?: boolean; }

const MembershipSchema = new Schema({ id: String, title: String, about: String });
const SpecialtiesSchema = new Schema({ id: String, title: String, about: String });
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
  id: String, name: String, location: String, address: String, collapsed: Boolean
});

const BusinessDaySchema = new Schema<BusinessDay>(
  {
    day: { type: String, required: true },
    enabled: { type: Boolean, default: true },
    slots: { type: [String], default: [] },
    fee: { type: Schema.Types.Mixed }, // number or string depending on your UI
    spaces: { type: [String], default: [] },
  },
  { _id: false }
);


export interface IDoctor extends Document {
  userId?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  designation?: string;
  phone?: string;
  email?: string;
  imageUrl?: string;
  languages: string[];
  specialties: string[];
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
  userId: String,
  firstName: String,
  lastName: String,
  displayName: String,
  designation: String,
  phone: String,
  email: String,
  imageUrl: String,
  languages: [String],
  specialties: [SpecialtiesSchema],
  memberships: [MembershipSchema],
  experiences: [ExperienceSchema],
  education: [EducationSchema],
  awards: [AwardSchema],
  insurances: [InsuranceSchema],
  clinics: [ClinicSchema],
  businessHours: [BusinessDaySchema],
}, { timestamps: true });

export default mongoose.model<IDoctor>("Doctor", DoctorSchema);
