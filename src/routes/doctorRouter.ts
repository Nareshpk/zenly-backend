import express from "express";
import { addAward, addClinic, addEducation, addExperience, addInsurance, createDoctor, getAllDoctors, getDoctorAppointmentByUserId, getDoctorByUserId, saveBusinessHoursController } from "../controllers/doctorController";
import { uploadImage } from "../middleware/upload";


const router = express.Router();
router.post("/create", uploadImage.fields([{ name: "imageFile", maxCount: 1 }]), createDoctor);
router.post("/create/:doctorId/experience", uploadImage.fields([{ name: "experienceLogo", maxCount: 10 }]), addExperience);
router.post("/create/:doctorId/education", uploadImage.fields([{ name: "educationLogo", maxCount: 10 }]), addEducation);
router.post("/create/:doctorId/awards", addAward);
router.post("/create/:doctorId/insurances", uploadImage.fields([{ name: "insuranceLogo", maxCount: 10 }]), addInsurance);
router.post(
  "/create/:doctorId/clinics",
  addClinic
);
router.post("/create/:doctorId/business-hours", saveBusinessHoursController);
router.get("/get/doctorsAll", getAllDoctors);
router.get("/get/doctorsById/:id", getDoctorByUserId);
router.get("/get/appointment/:id", getDoctorAppointmentByUserId);
export default router;
