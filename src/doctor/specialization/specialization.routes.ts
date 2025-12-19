import { Router } from "express";
import { createSpecialization, getAllSpecializations, getSpecializationById, updateSpecialization, toggleSpecializationStatus, deleteSpecialization } from "./specialization.controller";


const router = Router();

router.post("/", createSpecialization);
router.get("/get-all", getAllSpecializations);
router.get("/get-id/:id", getSpecializationById);
router.put("/:id", updateSpecialization);
router.patch("/:id/toggle", toggleSpecializationStatus);
router.delete("/:id", deleteSpecialization);

export default router;
