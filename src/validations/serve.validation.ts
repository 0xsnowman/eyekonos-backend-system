import { Joi } from "express-validation";

export const ServeValidation = {
  getFile: {
    params: Joi.object({
      fileName: Joi.string().required(),
    }),
  },
};
