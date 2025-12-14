import { Router } from "express";
import {
  createAppointment,
  getAppointmentsByDoctor,
  updateAppointment,
  deleteAppointment,
  updateAppointmentStatus,
  getPatientNotifications,
  startAppointment,
  endAppointment,
  getAppointmentsByPatient,
} from "../controllers/appointment.controller";

const router = Router();

router.post("/create", createAppointment);
router.get("/get/doctor/:doctorId", getAppointmentsByDoctor);
router.get("/get/patient/:patientId", getAppointmentsByPatient);
router.put("/update/:id", updateAppointment);
router.delete("/delete/:id", deleteAppointment);
router.put("/updateStatus/:id/status", updateAppointmentStatus);
router.put("/updatestart/:id/start", startAppointment);
router.put("/updateend/:id/end", endAppointment)

export default router;
