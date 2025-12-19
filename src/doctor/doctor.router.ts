import { Router } from "express";
import { createDoctor, getAllDoctors, getDoctorById, updateDoctor, updateDoctorStatus } from "./doctor.controller";
import { uploadImage } from "../middleware/upload";


const router = Router();

router.post(
  "/",
  uploadImage.single("profileImage"), // 🔥 multer
  createDoctor
);

router.get("/", getAllDoctors);
router.get("/:id", getDoctorById);

/* UPDATE (FULL) */
router.put("/:id", uploadImage.single("profileImage"), updateDoctor);

/* UPDATE STATUS ONLY */
router.patch("/:id/status", updateDoctorStatus);

export default router;
