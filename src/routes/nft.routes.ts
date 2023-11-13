import express from "express";
import { validate } from "../helpers/validator";
import {
  getNFTs,
  createNFT,
  updateNFT,
  deleteNFT,
} from "../controllers/nft.controller";
import { NFTValidation } from "../validations/nft.validation";

const router = express.Router();

router.route("/get-nfts").get(getNFTs);

router.route("/create").post(validate(NFTValidation.createNFT), createNFT);

router.route("/update").post(validate(NFTValidation.updateNFT), updateNFT);

router.route("/delete").post(validate(NFTValidation.deleteNFT), deleteNFT);

export default router;
