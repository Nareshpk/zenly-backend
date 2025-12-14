import { Schema, model, Document, Types } from "mongoose";

export interface IAppointment extends Document {
  doctorId: Types.ObjectId;
  appointmentNo: string;
  patientId: any;
  email: string,
  age: string,
  sex: string,
  bloodGroup: string,
  address: string,
  patientName: string;
  doctorName: string;
  appointmentType: "Audio Call" | "Video Call" | "Direct Visit";
  date: string;
  time: string;
  consultationFor: string;
  status: "Pending" | "Confirmed" | "Cancelled" | "In Progress" | "Completed";

  specialties: string;
  clinics: string;
  location: string;

  startedAt?: Date;      // when doctor clicks "Start Now"
  endedAt?: Date;        // when doctor clicks "End"
  durationInSeconds?: number; // total meeting duration

  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
    patientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    appointmentNo: { type: String, required: true, unique: true },
    patientName: { type: String, required: true },
    doctorName: { type: String, required: true },

    email: { type: String, required: true },
    age: { type: String, required: true },
    sex: { type: String, required: true },
    bloodGroup: { type: String, required: true },
    address: { type: String, required: true },

    specialties: { type: String, required: true },
    clinics: { type: String, required: true },
    location: { type: String, required: true },

    appointmentType: {
      type: String,
      enum: ["Audio Call", "Video Call", "Direct Visit"],
      required: true,
    },

    date: { type: String, required: true },
    time: { type: String, required: true },
    consultationFor: { type: String },

    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled", "In Progress", "Completed"],
      default: "Pending",
    },

    startedAt: { type: Date },                 // ⏱ start
    endedAt: { type: Date },                   // ⏱ end
    durationInSeconds: { type: Number },       // ⏱ total seconds
  },
  { timestamps: true }
);


export default model<IAppointment>("Appointment", AppointmentSchema);
