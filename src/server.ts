import path from "path";
import express from "express";
import cors from "cors";
import http from "http";
import dotenv from "dotenv";
import { initSocket } from "./socket";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import doctorRoutes from "./routes/doctorRouter";
import businessHoursRoutes from "./routes/businessHoursRoutes";
import appointmentRoutes from "./routes/appointment.routes"

import notificationRoutes from "./routes/notification.routes";
import userProfileRoutes from "./routes/userProfile.routes";
import uploadRoutes from "./routes/uploadRoutes"
import messageRoutes from "./routes/messageRoutes";
import aiChatRoute from "./routes/aiChat";
dotenv.config();

const app = express()
const port = process.env.PORT || 5000

app.use(cors({
  origin: "*",
  credentials: true
}));


app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/business", businessHoursRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/user-profile", userProfileRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/ai", aiChatRoute);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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

