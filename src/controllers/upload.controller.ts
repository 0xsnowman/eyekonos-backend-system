import { Response, NextFunction } from "express";
import { CRequest } from "../core/api-custom";
import httpStatus from "http-status";
import {
  uploadFile,
  deleteFile as deleteFileService,
} from "../services/upload.service";

export async function upload(req: CRequest, res: Response, next: NextFunction) {
  try {
    if (Object.keys(req.files).length === 0) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: "No files were uploaded",
      });
    }
    const file = req.files.file;
    const result = await uploadFile(file);
    if (result.success) {
      return res.status(httpStatus.OK).json(result);
    } else {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(result);
    }
  } catch (err) {
    next(err);
  }
}

export function deleteFile(req: CRequest, res: Response, next: NextFunction) {
  try {
    const fileName = req.body.fileName;
    deleteFileService(fileName);
    return res
      .status(httpStatus.OK)
      .json({ message: "Successfully deleted file from server" });
  } catch (err) {
    next(err);
  }
}
