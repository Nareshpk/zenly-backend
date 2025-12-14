// middleware/upload.ts
import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 9)}${ext}`;
    cb(null, name);
  },
});

// IMAGE
const imageFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  const allowed = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/svg+xml",
    "image/webp",
  ];
  cb(null, allowed.includes(file.mimetype));
};

// AUDIO
const audioFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  const allowed = [
    "audio/mpeg",
    "audio/wav",
    "audio/webm",
    "audio/mp4",
  ];
  cb(null, allowed.includes(file.mimetype));
};

// 🎥 VIDEO
const videoFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  const allowed = [
    "video/mp4",
    "video/webm",
    "video/ogg",
    "video/quicktime", // .mov
  ];
  cb(null, allowed.includes(file.mimetype));
};

export const uploadImage = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 4 * 1024 * 1024 },
});

export const uploadAudio = multer({
  storage,
  fileFilter: audioFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

export const uploadVideo = multer({
  storage,
  fileFilter: videoFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});
