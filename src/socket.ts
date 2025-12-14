import { Server } from "socket.io";
import Message from "./models/Message";

let io: Server;

export const initSocket = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("✅ Socket connected:", socket.id);

    // Join room (appointmentId)
    socket.on("join", (roomId: string) => {
      socket.join(roomId);
      console.log("User joined room:", roomId);
    });

    // 🔔 Call events
    socket.on("call-user", ({ roomId, appointmentId, caller }) => {
      console.log("📞 Call started:", appointmentId);

      socket.to(roomId).emit("incoming-call", {
        appointmentId,
        caller,
      });
    });

    socket.on("accept-call", ({ roomId }) => {
      socket.to(roomId).emit("call-accepted");
    });

    socket.on("reject-call", ({ roomId }) => {
      socket.to(roomId).emit("call-rejected");
    });

    // WebRTC signaling
    socket.on("offer", ({ roomId, offer }) => {
      socket.to(roomId).emit("offer", offer);
    });

    socket.on("answer", ({ roomId, answer }) => {
      socket.to(roomId).emit("answer", answer);
    });

    socket.on("ice-candidate", ({ roomId, candidate }) => {
      socket.to(roomId).emit("ice-candidate", candidate);
    });

    socket.on("call-status", ({ roomId, status }) => {
      socket.to(roomId).emit("call-status", status);
    });

    socket.on("send-message", async ({ roomId, message }) => {
      try {

        await Message.create({
          roomId,
          from: message.from,
          to: message.to,
          type: message.type,
          text: message.text,
          imageUrl: message.imageUrl,
          audioUrl: message.audioUrl,
          videoUrl: message.videoUrl,
          time: message.time,
        });

        // 🔴 SEND TO OTHER USER
        socket.to(roomId).emit("receive-message", message);
      } catch (err) {
        console.error("Message save error:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected:", socket.id);
    });
  });
};

export const getIO = () => {
  if (!io) throw new Error("Socket not initialized");
  return io;
};
