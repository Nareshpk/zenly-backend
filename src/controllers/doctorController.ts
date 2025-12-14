import { Request, Response } from "express";
import Doctor from "../models/Doctor";
import mongoose from "mongoose";

export const createDoctor = async (req: Request, res: Response) => {
    try {
        const files = (req as any).files as { [fieldname: string]: Express.Multer.File[] } | undefined;
        const imageFile = files?.imageFile?.[0];
        const imageUrl = imageFile ? `/uploads/${imageFile.filename}` : undefined;

        const doc = new Doctor({
            userId: req.body.userId,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            displayName: req.body.displayName,
            designation: req.body.designation,
            phone: req.body.phone,
            email: req.body.email,
            imageUrl,
            specialties: req.body.languages ? req.body.specialties : [],
            languages: req.body.languages ? req.body.languages : [],
            memberships: req.body.memberships ? req.body.memberships : []
        });

        await doc.save();
        return res.status(201).json(doc);
    } catch (err: any) {
        console.error("createDoctor error:", err);
        if (err instanceof Error && /Only images|File too large/i.test(err.message)) {
            return res.status(400).json({ message: err.message });
        }
        return res.status(500).json({ message: "Server error" });
    }
};


export const addExperience = async (req: Request, res: Response) => {
    try {
        const { doctorId } = req.params;
        const doc = await Doctor.findById(doctorId);
        if (!doc) return res.status(404).json({ message: "Doctor not found" });

        const experiences = req.body.experience ? req.body.experience : [];


        const expArray = Array.isArray(experiences) ? experiences : [experiences];


        const file = (req as any).files?.experienceLogo?.[0];


        expArray.forEach((exp) => {
            if (file) {
                exp.logo = `/uploads/${file.filename}`;
            }
            doc.experiences.push(exp);
        });

        await doc.save();
        return res.status(201).json(doc.experiences);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};



export const addEducation = async (req: Request, res: Response) => {
    try {
        const { doctorId } = req.params;
        const doc = await Doctor.findById(doctorId);
        if (!doc) return res.status(404).json({ message: "Doctor not found" });


        const education = req.body.education ? req.body.education : [];

        const eduArray = Array.isArray(education) ? education : [];
        const file = (req as any).files?.educationLogo?.[0];
        eduArray.forEach((edu) => {
            if (file) {
                edu.logo = `/uploads/${file.filename}`;
            }
            doc.education.push(edu);
        });

        await doc.save();
        return res.status(201).json(doc.education);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};


export const addAward = async (req: Request, res: Response) => {
    const { doctorId } = req.params;
    const doc = await Doctor.findById(doctorId);
    if (!doc) return res.status(404).json({ message: "Doctor not found" });

    const award = req.body.award ? req.body.award : [];
    const awardArray = Array.isArray(award) ? award : [];


    awardArray.forEach((edu: any) => {
        doc.awards.push(edu);
    });
    await doc.save();
    return res.status(201).json(award);
};


export const addInsurance = async (req: Request, res: Response) => {
    try {
        const { doctorId } = req.params;
        const doc = await Doctor.findById(doctorId);
        if (!doc) return res.status(404).json({ message: "Doctor not found" });


        const insurance = req.body.insurance ? req.body.insurance : [];
        const insArray = Array.isArray(insurance) ? insurance : [];
        const file = (req as any).files?.insuranceLogo?.[0];

        insArray.forEach((ins) => {
            if (file) {
                ins.logo = `/uploads/${file.filename}`;
            }
            doc.insurances.push(ins);
        });

        await doc.save();
        return res.status(201).json(doc.insurances);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

export const addClinic = async (req: Request, res: Response) => {
    try {
        const { doctorId } = req.params;
        const doc = await Doctor.findById(doctorId);
        if (!doc) return res.status(404).json({ message: "Doctor not found" });

        const clinic = req.body.clinic ? req.body.clinic : {};
        const clinicArray = Array.isArray(clinic) ? clinic : [];


        clinicArray.forEach((edu: any) => {
            doc.clinics.push(edu);
        });
        await doc.save();

        return res.status(201).json(clinic);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error", error: err });
    }
};

export const saveBusinessHoursController = async (req: Request, res: Response) => {
    try {
        const { doctorId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(doctorId)) return res.status(400).json({ message: "Invalid doctor id" });

        const hours = req.body.hours;
        if (!Array.isArray(hours)) return res.status(400).json({ message: "hours must be an array" });

        const validDays = new Set(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]);
        for (const h of hours) {
            if (!h.day || !validDays.has(h.day)) return res.status(400).json({ message: "Invalid day in hours" });
            if (h.enabled) {
                const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
                if (h.open && !timeRegex.test(h.open)) return res.status(400).json({ message: `Invalid open time for ${h.day}` });
                if (h.close && !timeRegex.test(h.close)) return res.status(400).json({ message: `Invalid close time for ${h.day}` });
            }
        }

        const doc = await Doctor.findById(doctorId);
        if (!doc) return res.status(404).json({ message: "Doctor not found" });
        doc.businessHours = hours;
        await doc.save();

        return res.status(200).json({ message: "Business hours saved", businessHours: doc.businessHours });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error", error: err });
    }



};


export const getAllDoctors = async (req: Request, res: Response) => {
    const doctors = await Doctor.find();
    res.json(doctors);
};

export const getDoctorByUserId = async (req: Request, res: Response) => {
    try {
        const doctor = await Doctor.findOne({ userId: req.params.id });

        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        return res.status(200).json(doctor);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};

export const getDoctorAppointmentByUserId = async (req: Request, res: Response) => {
    try {
        const doctor = await Doctor.findById(req.params.id);

        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        return res.status(200).json(doctor);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};

