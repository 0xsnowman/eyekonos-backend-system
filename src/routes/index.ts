import express from "express";
import authRoutes from "./auth.routes";

const router = express.Router();

router.get("/health-check", async (req, res) => {
  return res.status(200).json({ message: "Server health OK" });
});

router.use("/auth", authRoutes);

export default router;
