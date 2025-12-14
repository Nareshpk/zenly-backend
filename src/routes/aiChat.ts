import express from "express";
import Groq from "groq-sdk";

import Appointment from "../models/Appointment";
import Doctor from "../models/Doctor";
import User from "../models/User";
import UserProfile from "../models/UserProfile";
import Message from "../models/Message";
import Notification from "../models/Notification";

const router = express.Router();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "message is required" });
    }

    /* -------------------- 1️⃣ READ DATABASE -------------------- */

    // Users
    const users = await User.find()
      .select("name role email")
      .limit(5);

    // User Profiles
    const profiles = await UserProfile.find()
      .select("age sex bloodGroup address")
      .limit(5);

    // Doctors
    const doctors = await Doctor.find()
      .select("displayName designation specialties clinics")
      .limit(5);

    // Appointments
    const appointments = await Appointment.find()
      .select("patientName doctorName date time status appointmentType location")
      .sort({ createdAt: -1 })
      .limit(5);

    // Messages (chat history)
    const messages = await Message.find()
      .select("from to type text time")
      .sort({ createdAt: -1 })
      .limit(5);

    // Notifications
    const notifications = await Notification.find()
      .select("title message isRead")
      .sort({ createdAt: -1 })
      .limit(5);

    /* -------------------- 2️⃣ FORMAT DATA -------------------- */

    const userText = users.map(
      (u, i) => `User ${i + 1}: ${u.name} (${u.role})`
    ).join("\n");

    const profileText = profiles.map(
      (p, i) =>
        `Profile ${i + 1}: Age ${p.age}, Sex ${p.sex}, Blood Group ${p.bloodGroup}`
    ).join("\n");

    const doctorText = doctors.map(
      (d, i) =>
        `Doctor ${i + 1}: ${d.displayName}, ${d.designation}`
    ).join("\n");

    const appointmentText = appointments.map(
      (a, i) =>
        `Appointment ${i + 1}: Patient ${a.patientName}, Doctor ${a.doctorName}, Date ${a.date}, Time ${a.time}, Status ${a.status}`
    ).join("\n");

    const messageText = messages.map(
      (m, i) =>
        `Message ${i + 1}: From ${m.from} to ${m.to}, Type ${m.type}, Text "${m.text}"`
    ).join("\n");

    const notificationText = notifications.map(
      (n, i) =>
        `Notification ${i + 1}: ${n.title} - ${n.message} (Read: ${n.isRead})`
    ).join("\n");

    /* -------------------- 3️⃣ BUILD AI PROMPT -------------------- */

    const prompt = `
You are a healthcare system assistant.

SYSTEM DATA:

USERS:
${userText}

PROFILES:
${profileText}

DOCTORS:
${doctorText}

APPOINTMENTS:
${appointmentText}

MESSAGES:
${messageText}

NOTIFICATIONS:
${notificationText}

USER QUESTION:
"${message}"

RULES:
- Answer only using the given data
- If data is not available, say so clearly
- Be concise
- Reply only in English
`;

    /* -------------------- 4️⃣ GROQ AI -------------------- */

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
    });

    /* -------------------- 5️⃣ SEND RESPONSE -------------------- */

    res.json({
      reply: completion.choices[0].message.content,
    });

  } catch (error: any) {
    console.error("Groq AI error:", error.message);
    res.status(500).json({ error: "AI not responding" });
  }
});

export default router;
