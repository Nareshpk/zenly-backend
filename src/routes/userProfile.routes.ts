import { Router } from "express";
import {
  saveUserProfile,
  getUserProfile,
} from "../controllers/userProfile.controller";
import { uploadImage } from "../middleware/upload";


const router = Router();

router.post("/:userId", uploadImage.fields([{ name: "profile", maxCount: 1 }]), saveUserProfile);   // create / update
router.get("/:userId", getUserProfile);     // fetch

export default router;
