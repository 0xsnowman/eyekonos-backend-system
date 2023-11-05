import { Joi } from "express-validation";

export const AuthValidation = {
  login: {
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  },
  signup: {
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  },
  resendEmailVerification: {
    body: Joi.object({
      email: Joi.string().email().required(),
    }),
  },
  verifyEmail: {
    body: Joi.object({
      token: Joi.string().length(6).required(),
    }),
  },
};
