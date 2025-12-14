import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        // appointmentId (room)
        roomId: {
            type: String,
            required: true,
            index: true, // 🔥 fast history fetch
        },

        // sender & receiver
        from: {
            type: String,
            required: true,
            index: true,
        },

        to: {
            type: String,
            required: true,
            index: true,
        },

        // message type
        type: {
            type: String,
            enum: ["text", "image", "audio", "video"],
            required: true,
        },

        // content (only one used depending on type)
        text: {
            type: String,
            trim: true,
        },

        imageUrl: {
            type: String,
        },

        audioUrl: {
            type: String,
        },

        videoUrl: {
            type: String,
        },

        // UI time (HH:MM)
        time: {
            type: String,
            required: true,
        },

        // delivery status
        status: {
            type: String,
            enum: ["sent", "delivered", "seen"],
            default: "sent",
        },
    },
    {
        timestamps: true, // createdAt, updatedAt
    }
);

/* ---------------- VALIDATION ---------------- */

messageSchema.pre("validate", function () {
  if (this.type === "text" && !this.text) {
    throw new Error("Text message must have text");
  }

  if (this.type === "image" && !this.imageUrl) {
    throw new Error("Image message must have imageUrl");
  }

  if (this.type === "audio" && !this.audioUrl) {
    throw new Error("Audio message must have audioUrl");
  }

  if (this.type === "video" && !this.videoUrl) {
    throw new Error("Video message must have videoUrl");
  }
});

/* ---------------- INDEXES ---------------- */

// fetch conversation history fast
messageSchema.index({ roomId: 1, createdAt: 1 });

export default mongoose.model("Message", messageSchema);
