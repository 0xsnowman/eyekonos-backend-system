import express from "express";
import authRoutes from "./auth.routes";
import eventBriteRoutes from "./eventbrite.routes";
import { oauth } from "../modules/oauth/oauth";

const router = express.Router();

router.get("/health-check", async (req, res) => {
  return res.status(200).json({ message: "Server health OK" });
});

router.use("/auth", authRoutes);

router.use("/eventbrite", oauth.authorise(), eventBriteRoutes);

export default router;
