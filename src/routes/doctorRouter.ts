import express from "express";
import { addAward, addClinic, addEducation, addExperience, addInsurance, createDoctor, saveBusinessHoursController } from "../controllers/doctorController";
import { upload } from "../middleware/upload";

const router = express.Router();
router.post("/create", upload.fields([{ name: "imageFile", maxCount: 1 }]), createDoctor);
router.post("/create/:doctorId/experience", upload.fields([{ name: "experienceLogo", maxCount: 10 }]), addExperience);
router.post("/create/:doctorId/education", upload.fields([{ name: "educationLogo", maxCount: 10 }]), addEducation);
router.post("/create/:doctorId/awards", addAward);
router.post("/create/:doctorId/insurances", upload.fields([{ name: "insuranceLogo", maxCount: 10 }]), addInsurance);
router.post(
  "/create/:doctorId/clinics",
  upload.fields([
    { name: "clinicLogo", maxCount: 1 },
    { name: "gallery", maxCount: 10 },
  ]),
  addClinic
);
router.post("/create/:doctorId/business-hours", saveBusinessHoursController);
export default router;
