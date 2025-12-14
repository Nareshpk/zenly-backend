import express from "express";
import { uploadImage, uploadAudio, uploadVideo } from "../middleware/upload";

const router = express.Router();

// IMAGE UPLOAD
router.post("/image", uploadImage.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false });
  }

  res.json({
    success: true,
    url: `/uploads/${req.file.filename}`,
  });
});

// AUDIO UPLOAD
router.post("/audio", uploadAudio.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false });
  }

  res.json({
    success: true,
    url: `/uploads/${req.file.filename}`,
  });
});


router.post("/video", uploadVideo.single("file"), (req, res) => {
  res.json({ url: `/uploads/${req.file?.filename}` });
});


export default router;
