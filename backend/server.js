require("dotenv").config();
const express = require("express");
const cors = require("cors")
const path = require("path");
const connectDB = require("./config/db");
const app = express();
const authRoutes = require("./routes/authRoutes")
const userRoutes = require("./routes/userRoutes")
const taskRoutes = require("./routes/taskRoutes")
const reportRoutes = require("./routes/reportRoutes")

app.use(cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET","POST","PUT","DELETE"],
    allowedHeaders:["Content-Type","Authorization"]
}))

app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/tasks",taskRoutes)
app.use("/api/report",reportRoutes)
connectDB()

const port = process.env.PORT
app.listen(port,()=>console.log(`Server is running on port ${port}`));