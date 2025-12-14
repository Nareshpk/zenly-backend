import express from "express";
import Message from "../models/Message";

const router = express.Router();

// GET CHAT HISTORY BY ROOM (appointment)
router.get("/:roomId", async (req, res) => {
  try {
    const messages = await Message.find({
      roomId: req.params.roomId,
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Failed to load messages" });
  }
});

export default router;
