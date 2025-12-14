import { Schema, model, Types } from "mongoose";

const NotificationSchema = new Schema(
    {
        doctorId: { type: Types.ObjectId, ref: "Doctor", required: true },
        patientId: { type: Types.ObjectId, ref: "User", required: true },
        title: { type: String, required: true },
        message: { type: String, required: true },
        appointmentId: { type: Types.ObjectId, ref: "Appointment" },
        isRead: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export default model("Notification", NotificationSchema);
