import { Router } from "express";
import { chatStream } from "../controllers/ai.controller";

const router = Router();

router.post("/chat-stream", chatStream);

export default router;
