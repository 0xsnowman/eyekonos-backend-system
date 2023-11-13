import { Response, NextFunction } from "express";
import { CRequest } from "../core/api-custom";
import httpStatus from "http-status";
import { InternalError, BadRequestError } from "../core/api-error";
import {
  createNewNFT,
  updateNFT as updateNFTService,
  deleteNFT as deleteNFTService,
  listNFTs as listNFTsService,
} from "../services/nft.service";

export const getNFTs = async (req: CRequest, res: Response) => {
  const user = req.user.id;
  const result = await listNFTsService(user);
  if (result.success) {
    return res.status(httpStatus.OK).json(result);
  } else {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(result);
  }
};

export const createNFT = async (req: CRequest, res: Response) => {
  const user = req.user.id;
  const { name, description, image, traits } = req.body;
  const result = await createNewNFT(user, name, description, image, traits);
  if (result.success) {
    return res.status(httpStatus.OK).json(result);
  } else {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(result);
  }
};

export const updateNFT = async (req: CRequest, res: Response) => {
  const { nftId, name, description, image, traits } = req.body;
  const result = await updateNFTService(
    nftId,
    name,
    description,
    image,
    traits
  );
  if (result.success) {
    return res.status(httpStatus.OK).json(result);
  } else {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(result);
  }
};

export const deleteNFT = async (req: CRequest, res: Response) => {
  const user = req.user.id;
  const { nftId } = req.body;
  const result = await deleteNFTService(user, nftId);
  if (result.success) {
    return res.status(httpStatus.OK).json(result);
  } else {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(result);
  }
};
