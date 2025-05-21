import express from "express";
import dotenv from "dotenv";
import cors from "cors"; // ✅ EKLENDİ

import { connectDB } from "./lib/db.js";
import solverRoutes from "./routes/solver.routes.js";
import dataRoutes from "./routes/data.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS MIDDLEWARE EKLE
app.use(cors());

// ✅ JSON parse için gerekli
app.use(express.json());

// ✅ Route'ları tanımla
app.use("/api/v1/solver", solverRoutes);
app.use("/api/v1/data", dataRoutes);

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  connectDB();
});
