import { Request, Response } from "express";
import axios from "axios";


export const chatStream = async (req: Request, res: Response) => {
  try {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const { question, email } = req.body;

    if (!question) {
      res.write("data: Invalid question\n\n");
      return res.end();
    }

    const response = await axios.post(
      "http://localhost:8000/api/ai/stream",
      { question, email },
      { responseType: "stream" }
    );

    response.data.on("data", (chunk: Buffer) => {
      res.write(chunk.toString());
    });

    response.data.on("end", () => {
      res.write("data: [DONE]\n\n");
      res.end();
    });

    response.data.on("error", (err: any) => {
      console.error("Python stream error:", err);
      res.end();
    });
  } catch (err) {
    console.error("Express stream error:", err);
    res.end();
  }
};

