import express from "express";
import authRoutes from "./auth.routes";
import eventBriteRoutes from "./eventbrite.routes";
import uploadRoutes from "./upload.routes";
import serveRoutes from "./serve.routes";
import nftRoutes from "./nft.routes";
import { oauth } from "../modules/oauth/oauth";

const router = express.Router();

router.get("/health-check", async (req, res) => {
  return res.status(200).json({ message: "Server health OK" });
});

router.use("/auth", authRoutes);

router.use("/eventbrite", oauth.authorise(), eventBriteRoutes);

router.use("/file", oauth.authorise(), uploadRoutes);

router.use("/nft", oauth.authorise(), nftRoutes);

router.use("/serve", serveRoutes);

export default router;
