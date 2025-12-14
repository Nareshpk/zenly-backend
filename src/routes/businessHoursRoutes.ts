// routes/businessHoursRoutes.ts
import express from "express";
import {
  saveBusinessHours,
  getBusinessHours,
  updateBusinessDay,
  deleteBusinessHours,
} from "../controllers/businessHoursController";

const router = express.Router({ mergeParams: true });

// Save/replace whole business hours
router.post("/:doctorId/business-hours", saveBusinessHours); // POST to create/replace
router.put("/:doctorId/business-hours", saveBusinessHours); // PUT also allowed (idempotent)

// Get
router.get("/:doctorId/business-hours", getBusinessHours);

// Update single day
router.patch("/:doctorId/business-hours/:day", updateBusinessDay);

// Delete (all or single)
router.delete("/:doctorId/business-hours", deleteBusinessHours);

export default router;
