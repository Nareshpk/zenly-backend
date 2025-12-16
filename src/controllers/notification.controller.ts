import { Request, Response } from "express";
import Notification from "../models/Notification";
import { getIO } from "../socket";

export const getPatientNotifications = async (
  req: Request,
  res: Response
) => {
  try {
    const { patientId } = req.params;
    console.log("patientId====================>>" + patientId);

    const notifications = await Notification.find({ patientId })
      .sort({ createdAt: -1 });

    return res.status(200).json(notifications);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  const { id } = req.params;

  const notification = await Notification.findByIdAndUpdate(
    id,
    { isRead: true },
    { new: true }
  );

  res.json(notification);
};

// DELETE
export const deleteNotification = async (req: Request, res: Response) => {
  const { id } = req.params;
  await Notification.findByIdAndDelete(id);
  res.json({ success: true });
};


export const getDoctorNotifications = async (req: Request, res: Response) => {
  const { doctorId } = req.params;
  const notifications = await Notification.find({ doctorId })
    .sort({ createdAt: -1 });

  res.json(notifications);
};


export const sendAppointmentNotification = async ({
  doctorId,
  patientId,
  appointmentId,
  message,
}: any) => {
  // 1️⃣ Save notification in DB
  const notification = await Notification.create({
    doctorId,
    patientId,
    title: "New Appointment Booked",
    message,
    appointmentId,
  });

  // 2️⃣ Emit socket event to doctor
  const io = getIO();

  io.to(doctorId.toString()).emit("new-notification", {
    _id: notification._id,
    title: notification.title,
    message: notification.message,
    appointmentId,
    createdAt: notification.createdAt,
  });

  io.to(patientId).emit("new-notification", {
    _id: notification._id,
    title: notification.title,
    message: notification.message,
    appointmentId,
    createdAt: notification.createdAt,
  });
};
