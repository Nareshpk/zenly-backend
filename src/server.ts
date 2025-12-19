import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import path from "path";
import connectDB from "./config/db";
import appointmentRoutes from "./routes/appointment.routes";
import authRoutes from "./routes/authRoutes";
import businessHoursRoutes from "./routes/businessHoursRoutes";
import doctorRoutes from "./routes/doctorRouter";
import doctorAdminRoutes from "./doctor/doctor.router";
import { initSocket } from "./socket";

import aiRoutes from "./routes/ai.routes";
import messageRoutes from "./routes/messageRoutes";
import notificationRoutes from "./routes/notification.routes";
import uploadRoutes from "./routes/uploadRoutes";
import userProfileRoutes from "./routes/userProfile.routes";
import specializationRoutes from "./doctor/specialization/specialization.routes"

dotenv.config();

const app = express()
const port = process.env.PORT || 5000

app.use(cors({
  origin: "*",
  credentials: true
}));


app.use(express.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/business", businessHoursRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/user-profile", userProfileRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/admin/doctors", doctorAdminRoutes);
app.use("/api/admin/doctors/specializations", specializationRoutes);
// app.use("/api/ai", aiChatRoute);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// app.post("/api/ai/chat", async (req, res) => {
//   try {
//     const { message } = req.body;

//     // Call Python + Groq service
//     const response = await axios.post(
//       "http://127.0.0.1:5001/ai/chat",
//       { message }
//     );

//     res.json({
//       reply: response.data.reply,
//     });
//   } catch (error) {
//     res.status(500).json({
//       reply: "AI service not available",
//     });
//   }
// });

app.use("/api/ai", aiRoutes);

const server = http.createServer(app);

initSocket(server);

server.listen(5000, () => {
  console.log("Server running on port 5000");
});

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
}).catch((err) => {
  console.error('Database connection failed:', err)
})

