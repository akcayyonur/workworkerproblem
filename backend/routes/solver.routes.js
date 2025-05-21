import express from "express";
import axios from "axios";

const router = express.Router();

router.post("/run", async (req, res) => {
    try {
        const response = await axios.post("http://127.0.0.1:8000/solve", req.body);
        res.json(response.data);
    } catch (error) {
        console.error("Hata:", error.message);
        res.status(500).json({ error: "Python servisine ulaşılamadı." });
    }
});

export default router;
