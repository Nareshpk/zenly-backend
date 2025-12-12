import path from "path";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import doctorRoutes from "./routes/doctorRouter";
import express from "express";
import cors from "cors";

const app = express()
const port = process.env.PORT || 5000


const allowedOrigins = ["http://localhost:3000"];

app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization","X-Requested-With","Accept"],
  credentials: true
}));


app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


connectDB().then(() => {
 app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
}).catch((err) => {
  console.error('Database connection failed:', err)
})

