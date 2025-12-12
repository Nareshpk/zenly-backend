// controllers/doctorController.ts (create)
import { Request, Response } from "express";
import Doctor from "../models/Doctor";
import mongoose from "mongoose";

export const createDoctor = async (req: Request, res: Response) => {
    try {
        // req.files is typed as any when using multer; cast to expected shape
        const files = (req as any).files as { [fieldname: string]: Express.Multer.File[] } | undefined;

        // profile image (field name "imageFile")
        const imageFile = files?.imageFile?.[0];
        const imageUrl = imageFile ? `/uploads/${imageFile.filename}` : undefined;

        const doc = new Doctor({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            displayName: req.body.displayName,
            designation: req.body.designation,
            phone: req.body.phone,
            email: req.body.email,
            imageUrl,
            languages: req.body.languages ? JSON.parse(req.body.languages) : [],
            memberships: req.body.memberships ? JSON.parse(req.body.memberships) : []
        });

        await doc.save();
        return res.status(201).json(doc);
    } catch (err: any) {
        console.error("createDoctor error:", err);
        // If multer validation error occurred (fileFilter or size), send clear message
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

        // Parse array sent from frontend
        const experiences = req.body.experience ? JSON.parse(req.body.experience) : [];

        // Ensure it's always an array
        const expArray = Array.isArray(experiences) ? experiences : [experiences];

        // Attach logo if uploaded (only one file per request)
        const file = (req as any).files?.experienceLogo?.[0];

        // Add each item separately
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



// controllers/educationController.ts
export const addEducation = async (req: Request, res: Response) => {
    try {
        const { doctorId } = req.params;
        const doc = await Doctor.findById(doctorId);
        if (!doc) return res.status(404).json({ message: "Doctor not found" });

        // Parse array sent from frontend
        const education = req.body.education ? JSON.parse(req.body.education) : [];

        // Ensure it's always an array
        const eduArray = Array.isArray(education) ? education : [];

        // Attach logo if uploaded (only one file per request)
        const file = (req as any).files?.educationLogo?.[0];

        // Add each item separately
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


// controllers/awardController.ts
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

// controllers/insuranceController.ts
export const addInsurance = async (req: Request, res: Response) => {
   try {
        const { doctorId } = req.params;
        const doc = await Doctor.findById(doctorId);
        if (!doc) return res.status(404).json({ message: "Doctor not found" });

        // Parse array sent from frontend
        const insurance = req.body.insurance ? JSON.parse(req.body.insurance) : [];


        const insArray = Array.isArray(insurance) ? insurance : [];

        // Attach logo if uploaded (only one file per request)
        const file = (req as any).files?.insuranceLogo?.[0];

        // Add each item separately
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

    const clinic = req.body.clinic ? JSON.parse(req.body.clinic) : {};

    // attach logo if uploaded
    const logoFile = (req as any).files?.clinicLogo?.[0];
    if (logoFile) clinic.logo = `/uploads/${logoFile.filename}`;

    // attach gallery files (can be multiple)
    const galleryFiles = (req as any).files?.gallery || [];
    clinic.gallery = (clinic.gallery || []).concat(galleryFiles.map((f: any) => `/uploads/${f.filename}`));

    doc.clinics = doc.clinics || [];
    doc.clinics.push(clinic);
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

    // Basic validation (optional but recommended)
    const validDays = new Set(["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]);
    for (const h of hours) {
      if (!h.day || !validDays.has(h.day)) return res.status(400).json({ message: "Invalid day in hours" });
      if (h.enabled) {
        // if enabled, ensure open/close are present or null allowed, your choice
        // optionally validate time format HH:MM via regex
        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
        if (h.open && !timeRegex.test(h.open)) return res.status(400).json({ message: `Invalid open time for ${h.day}` });
        if (h.close && !timeRegex.test(h.close)) return res.status(400).json({ message: `Invalid close time for ${h.day}` });
      }
    }

    const doc = await Doctor.findById(doctorId);
    if (!doc) return res.status(404).json({ message: "Doctor not found" });

    // Replace the businessHours field with provided hours (you may merge instead)
    doc.businessHours = hours;
    await doc.save();

    return res.status(200).json({ message: "Business hours saved", businessHours: doc.businessHours });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err });
  }
};