import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { connectDB } from "./lib/db.js";
import solverRoutes from "./routes/solver.routes.js";
import dataRoutes from "./routes/data.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS MIDDLEWARE
app.use(cors());

// JSON parse için gerekli
app.use(express.json());

// Route'ları tanımla
app.use("/api/v1/solver", solverRoutes);
app.use("/api/v1/data", dataRoutes);

// Server'ı başlatmadan ÖNCE database bağlantısını kur
const startServer = async () => {
  try {
    // Önce database'e bağlan
    await connectDB();
    
    // Database bağlantısı başarılı olursa server'ı başlat
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`🌐 Frontend can connect to: http://localhost:${PORT}`);
    });
    
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

// Server'ı başlat
startServer();