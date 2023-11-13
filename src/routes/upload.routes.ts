import express from "express";
import { validate } from "../helpers/validator";
import { upload, deleteFile } from "../controllers/upload.controller";
import { UploadValidation } from "../validations/upload.validation";

const router = express.Router();

router.route("/upload-file").post(upload);

router
  .route("/delete-file")
  .post(validate(UploadValidation.deleteFile), deleteFile);

export default router;
