// controllers/businessHoursController.ts
import { Request, Response } from "express";
import Doctor from "../models/Doctor";



export const saveBusinessHours = async (req: Request, res: Response) => {
  try {
    const { doctorId } = req.params;
    const { hours } = req.body; // accept either map or array

    if (!doctorId) return res.status(400).json({ message: "doctorId required" });
    if (!hours) return res.status(400).json({ message: "hours payload required" });

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    // Normalize: if client sends object map convert to array of BusinessDay
    let normalized: any[] = [];
    if (Array.isArray(hours)) {
      normalized = hours;
    } else if (typeof hours === "object") {
      // assume { slots: {...}, fee?: ... } or { Monday: [...] } style
      // Two common client shapes:
      // 1) hours = { slots: { Monday: [...], Tuesday: [...] }, fee: 254 }
      // 2) hours = { Monday: [...], Tuesday: [...] }
      if (hours.slots && typeof hours.slots === "object") {
        const fee = hours.fee;
        for (const day of Object.keys(hours.slots)) {
          normalized.push({
            day,
            slots: hours.slots[day] || [],
            fee: fee ?? undefined,
            enabled: true,
          });
        }
      } else {
        for (const day of Object.keys(hours)) {
          normalized.push({
            day,
            slots: hours[day] || [],
            enabled: true,
          });
        }
      }
    }

    // Replace the doctor's businessHours completely (idempotent PUT-like behavior)
    doctor.businessHours = normalized;
    await doctor.save();

    return res.status(200).json({ success: true, businessHours: doctor.businessHours });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err });
  }
};

// Get business hours
export const getBusinessHours = async (req: Request, res: Response) => {
  try {
    const { doctorId } = req.params;
    if (!doctorId) return res.status(400).json({ message: "doctorId required" });

    const doctor = await Doctor.findById(doctorId).select("businessHours");
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    return res.status(200).json({ businessHours: doctor.businessHours });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err });
  }
};

// Update single day (partial update)
export const updateBusinessDay = async (req: Request, res: Response) => {
  try {
    const { doctorId, day } = req.params; // e.g. /api/doctors/:doctorId/business-hours/:day
    const body = req.body;
    if (!doctorId || !day) return res.status(400).json({ message: "doctorId and day required" });

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const idx = (doctor.businessHours || []).findIndex((d) => d.day === day);
    if (idx === -1) {
      // add new day entry
      doctor.businessHours = doctor.businessHours || [];
      doctor.businessHours.push({ day, ...(body as any) });
    } else {
      doctor.businessHours[idx] = { ...doctor.businessHours[idx].toObject(), ...(body as any) };
    }
    await doctor.save();

    return res.status(200).json({ businessHours: doctor.businessHours });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err });
  }
};

// Delete all business hours or a single day
export const deleteBusinessHours = async (req: Request, res: Response) => {
  try {
    const { doctorId } = req.params;
    const { day } = req.query; // optional query ?day=Monday
    if (!doctorId) return res.status(400).json({ message: "doctorId required" });

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    if (day) {
      doctor.businessHours = (doctor.businessHours || []).filter((d) => d.day !== day);
    } else {
      doctor.businessHours = [];
    }

    await doctor.save();
    return res.status(200).json({ businessHours: doctor.businessHours });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err });
  }
};
