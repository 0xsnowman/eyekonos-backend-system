import express from "express";
import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";
import httpStatus from "http-status";
import { validate } from "../helpers/validator";
import { ServeValidation } from "../validations/serve.validation";

const router = express.Router();

router.get(
  "/get-file/:fileName",
  validate(ServeValidation.getFile),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const fileName = req.params.fileName;
      const filePath = path.resolve(__dirname, `../uploads/${fileName}`);

      if (fs.existsSync(filePath)) {
        return res.sendFile(filePath);
      } else {
        return res.status(httpStatus.OK).json({
          message: "File not exists",
        });
      }
    } catch (err) {
      next(err);
    }
  }
);

export default router;
