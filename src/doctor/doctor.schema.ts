import mongoose, { Schema, Document } from "mongoose";

/* ================= INTERFACES ================= */

export interface IDoctor extends Document {
    personal: {
        firstName: string;
        lastName: string;
        dob: Date;
        gender: string;
        address: string;
        city: string;
        state: string;
        zip: string;
        email: string;
        phone: string;
        emergencyName: string;
        emergencyPhone: string;
        profileImage?: string;
    };

    professional: {
        primarySpecialization: string;
        secondarySpecialization?: string;
        licenseNumber: string;
        licenseExpiry: Date;
        qualifications: string;
        experience: number;
        education: string;
        certifications: string;
        department: string;
        position: string;
        patientsCount: number;
    };

    account: {
        username: string;
        password: string;
        email: string;
    };

    access: {
        patientRecords: boolean;
        prescriptions: boolean;
        billing: boolean;
        reports: boolean;
    };

    notifications: {
        appointments: boolean;
        patientUpdates: boolean;
        system: boolean;
    };

    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

/* ================= SCHEMA ================= */

const DoctorSchema = new Schema<IDoctor>(
    {
        personal: {
            firstName: { type: String, required: true },
            lastName: { type: String, required: true },
            dob: { type: Date },
            gender: { type: String },
            address: { type: String },
            city: { type: String },
            state: { type: String },
            zip: { type: String },
            email: { type: String, required: true },
            phone: { type: String },
            emergencyName: { type: String },
            emergencyPhone: { type: String },
            profileImage: { type: String },
        },

        professional: {
            primarySpecialization: { type: String, required: true },
            secondarySpecialization: { type: String },
            licenseNumber: { type: String, required: true },
            licenseExpiry: { type: Date },
            qualifications: { type: String },
            experience: { type: Number },
            education: { type: String },
            certifications: { type: String },
            department: { type: String },
            position: { type: String },
            patientsCount: { type: Number }
        },

        account: {
            username: { type: String, required: true, unique: true },
            password: { type: String, required: true },
            email: { type: String, required: true },
        },

        access: {
            patientRecords: { type: Boolean, default: true },
            prescriptions: { type: Boolean, default: true },
            billing: { type: Boolean, default: false },
            reports: { type: Boolean, default: false },
        },

        notifications: {
            appointments: { type: Boolean, default: true },
            patientUpdates: { type: Boolean, default: true },
            system: { type: Boolean, default: true },
        },

        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

/* ================= MODEL ================= */

export const DoctorModel = mongoose.model<IDoctor>(
    "DoctorList",
    DoctorSchema
);
