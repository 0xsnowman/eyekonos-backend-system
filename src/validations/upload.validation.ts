import { Joi } from "express-validation";

export const UploadValidation = {
  deleteFile: {
    body: Joi.object({
      fileName: Joi.string().required(),
    }),
  },
};
