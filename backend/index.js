const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const engineerRoutes = require("./routes/engineers");
const projectRoutes = require("./routes/projects");
const assignmentRoutes = require("./routes/assignments");
const userRoutes = require("./routes/users");


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

console.log("Registering routes...");
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/engineers", engineerRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/assignments", assignmentRoutes);

console.log("Connecting to MongoDB...");
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => app.listen(5000, () => console.log("Server running on port 5000")))
  .catch((err) => console.error("MongoDB connection error:", err));
console.log('Connected to MongoDB')