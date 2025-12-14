import { Router } from "express";
import { deleteNotification, getPatientNotifications, markAsRead } from "../controllers/notification.controller";

const router = Router();

router.get("/:patientId", getPatientNotifications);
router.put("/:id/read", markAsRead);
router.delete("/:id", deleteNotification);

export default router;
