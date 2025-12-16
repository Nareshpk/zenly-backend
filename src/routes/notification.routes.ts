import { Router } from "express";
import { deleteNotification, getPatientNotifications, markAsRead, sendAppointmentNotification } from "../controllers/notification.controller";

const router = Router();

router.get("/patient/:patientId", getPatientNotifications);
router.put("/mark/:id/read", markAsRead);
router.delete("/delete/:id", deleteNotification);
router.post("/appointment", async (req, res) => {
    await sendAppointmentNotification(req.body);
    res.json({ success: true });
});

export default router;
