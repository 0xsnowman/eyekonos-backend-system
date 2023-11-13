import { Joi } from "express-validation";

export const NFTValidation = {
  createNFT: {
    body: Joi.object({
      name: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string().required(),
      traits: Joi.array().optional(),
    }),
  },
  updateNFT: {
    body: Joi.object({
      nftId: Joi.string().required(),
      name: Joi.string().optional(),
      description: Joi.string().optional(),
      image: Joi.string().optional(),
      traits: Joi.array().optional(),
    }),
  },
  deleteNFT: {
    body: Joi.object({
      nftId: Joi.string().required(),
    }),
  },
};
