import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
const express = require('express')

const app = express()
const port = process.env.PORT || 5000


app.use(express.json());

app.use("/api/auth", authRoutes);

connectDB().then(() => {
  console.log('Database connected successfully')
}).catch((err) => {
  console.error('Database connection failed:', err)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


