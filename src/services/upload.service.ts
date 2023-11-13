import fs from "fs";
import path from "path";
import { VALID_EXTENSIONS } from "../config/upload";
import { generateString } from "../utils/generate-string";

export const uploadFile = async (file: any) => {
  const fileNameSplited = file.name.split(".");
  const extension = fileNameSplited[fileNameSplited.length - 1];

  if (VALID_EXTENSIONS.indexOf(extension) < 0) {
    return {
      success: false,
      message: "Wrong file extension",
    };
  }

  const fileName = `${generateString(6)}-${generateString(6)}-${generateString(
    6
  )}-${generateString(6)}.${extension}`;

  try {
    await file.mv(path.resolve(__dirname, `../uploads/${fileName}`));
    return {
      success: true,
      message: "Uploaded Successfully",
      data: fileName,
    };
  } catch (err) {
    return {
      success: false,
      message: "Something went wrong during uploading file",
    };
  }
};

export const deleteFile = (fileName: string) => {
  let filePath = path.resolve(__dirname, `../uploads/${fileName}`);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};
