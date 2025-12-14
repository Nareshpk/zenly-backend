import { Request, Response } from "express";
import Appointment from "../models/Appointment";
import Notification from "../models/Notification";
import { getIO } from "../socket";
import mongoose from "mongoose";


export const createAppointment = async (req: Request, res: Response) => {
  try {
    const appointment = await Appointment.create({
      doctorId: req.body.doctorId,
      patientId: req.body.patientId,
      email: req.body.email,
      age: req.body.age,
      sex: req.body.sex,
      bloodGroup: req.body.address,
      address: req.body.address,
      appointmentNo: req.body.appointmentNo,
      patientName: req.body.patientName,
      doctorName: req.body.doctorName,
      appointmentType: req.body.appointmentType,
      date: req.body.date,
      time: req.body.time,
      consultationFor: req.body.consultationFor,
      status: req.body.status || "Pending",
      specialties: req.body.specialties,
      clinics: req.body.clinics,
      location: req.body.location
    });

    // 🔔 CREATE NOTIFICATION FOR DOCTOR
    const notification = await Notification.create({
      doctorId: appointment.doctorId, // IMPORTANT
      patientId: req.body.patientId,
      appointmentId: appointment._id,
      title: "New Appointment Request",
      message: `${appointment.patientName} requested an appointment (${appointment.appointmentType})`,
      isRead: false,
    });

    // 🔔 REAL-TIME SOCKET EVENT TO DOCTOR
    const io = getIO();
    io.to(String(appointment.doctorId)).emit("notification", notification);

    console.log(
      "📤 Appointment request notification sent to doctor:",
      String(appointment.doctorId)
    );

    return res.status(201).json({
      success: true,
      appointment,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


export const getAppointmentsByDoctor = async (req: Request, res: Response) => {
  try {
    const { doctorId } = req.params;

    const appointments = await Appointment.aggregate([
      {
        $match: { doctorId: new mongoose.Types.ObjectId(doctorId) },
      },
      {
        $lookup: {
          from: "userprofiles",
          localField: "patientId",
          foreignField: "userId",
          as: "patientProfile",
        },
      },
      {
        $unwind: {
          path: "$patientProfile",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
         doctorId: 1,
          appointmentNo: 1,
          patientId: 1,
          email:1,
          age: 1,
          sex: 1,
          bloodGroup: 1,
          address: 1,
          patientName: 1,
          doctorName:1,
          appointmentType: 1,
          date:1,
          time: 1,
          consultationFor: 1,
          status: 1,
        
          specialties: 1,
          clinics: 1,
          location:1,
        
          startedAt:1,
          endedAt: 1,
          durationInSeconds: 1,
        
          createdAt: 1,
          updatedAt: 1,
          avatar: "$patientProfile.avatar",
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


export const getAppointmentsByPatient = async (req: Request, res: Response) => {
  try {
    const { patientId } = req.params;

    const appointments = await Appointment.find({ patientId })
      .sort({ createdAt: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


export const updateAppointment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      {
        patientName: req.body.patientName,
        appointmentType: req.body.appointmentType,
        date: req.body.date,
        time: req.body.time,
        consultationFor: req.body.consultationFor,
        status: req.body.status,
      },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({ success: true, appointment });
  } catch (error) {
    res.status(400).json({ message: "Update failed" });
  }
};

export const deleteAppointment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await Appointment.findByIdAndDelete(id);

    res.json({ success: true, message: "Appointment deleted" });
  } catch (error) {
    res.status(400).json({ message: "Delete failed" });
  }
};


export const updateAppointmentStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    appointment.status = status;
    await appointment.save();

    const notification = await Notification.create({
      doctorId: appointment.doctorId,
      patientId: appointment.patientId,
      appointmentId: appointment._id,
      title: "Appointment Update",
      message:
        status === "Confirmed"
          ? `Your appointment ${appointment.appointmentNo} is confirmed`
          : `Your appointment ${appointment.appointmentNo} is rejected`,
    });

    // 🔔 SOCKET EVENT (IMPORTANT)
    const io = getIO();
    io.to(String(appointment.patientId)).emit("notification", notification);

    res.json({ success: true, appointment });
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};

export const getPatientNotifications = async (req: any, res: any) => {
  const { patientId } = req.params;

  const notifications = await Notification.find({ patientId })
    .sort({ createdAt: -1 });

  res.json(notifications);
};



export const startAppointment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      {
        status: "In Progress",
        startedAt: new Date(),
      },
      { new: true }
    );

    res.json({ success: true, appointment });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to start" });
  }
};


export const endAppointment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id);
    if (!appointment || !appointment.startedAt) {
      return res.status(400).json({ message: "Appointment not started" });
    }

    const endedAt = new Date();
    const durationInSeconds = Math.floor(
      (endedAt.getTime() - appointment.startedAt.getTime()) / 1000
    );

    appointment.status = "Completed";
    appointment.endedAt = endedAt;
    appointment.durationInSeconds = durationInSeconds;

    await appointment.save();

    res.json({ success: true, appointment });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to end" });
  }
};


