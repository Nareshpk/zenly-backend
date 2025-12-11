import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import express from "express";

const app = express()
const port = process.env.PORT || 5000


const allowedOrigins = ["http://localhost:3000"];

app.use(((req: express.Request, res: express.Response, next: express.NextFunction) => {
  const origin = req.headers.origin as string;

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
}) as express.RequestHandler);


app.use(express.json());

app.use("/api/auth", authRoutes);



connectDB().then(() => {
 app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
}).catch((err) => {
  console.error('Database connection failed:', err)
})

