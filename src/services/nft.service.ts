import { User } from "../models/user.model";
import { NFT } from "../models/nft.model";

export const createNewNFT = async (
  userId: string,
  name: string,
  description: string,
  image: string,
  traits?: any
) => {
  try {
    const nft = new NFT({
      name,
      description,
      image,
      traits,
    });
    const savedNFT = await nft.save();
    const user = await User.findOne({ _id: userId });
    if (user) {
      user.metaNfts?.push(savedNFT._id);
      const savedUser = await user.save();
      return {
        success: true,
        message: "Successfully created a NFT",
        data: { nft: savedNFT, user: savedUser },
      };
    } else {
      return {
        success: false,
        message: "Something went wrong when adding nft to user",
      };
    }
  } catch (err) {
    return {
      success: false,
      message: "Something went wrong when creating an NFT",
    };
  }
};

export const updateNFT = async (
  nftId: string,
  name?: string,
  description?: string,
  image?: string,
  traits?: any
) => {
  try {
    const nft = await NFT.findOne({ _id: nftId });
    if (nft) {
      const updates: any = {};
      if (name) updates.name = name;
      if (description) updates.description = description;
      if (image) updates.image = image;
      if (traits) updates.traits = traits;
      const updatedNFT = await NFT.findOneAndUpdate({ _id: nftId }, updates, {
        new: true,
      });
      return {
        success: true,
        message: "Successfully updated a NFT",
        data: { nft: updatedNFT },
      };
    } else {
      return {
        success: false,
        message: "Cannot find nft with specified id",
      };
    }
  } catch (err) {
    return {
      success: false,
      message: "Something went wrong when updating an NFT",
    };
  }
};

export const deleteNFT = async (userId: string, nftId: string) => {
  try {
    const nft = await NFT.findOne({ _id: nftId });
    if (nft) {
      await NFT.findOneAndDelete({ _id: nftId });
      const user = await User.findOne({ _id: userId });
      if (user) {
        if (nft.status === "meta") {
          const nftsList = user.metaNfts?.filter((nft) => nft !== nft._id);
          user.metaNfts = nftsList;
          const savedUser = await user.save();
          return {
            success: true,
            message: "Successfully deleted a NFT",
            data: { user: savedUser },
          };
        } else {
          const nftsList = user.nftClaimed?.filter((nft) => nft !== nft._id);
          user.nftClaimed = nftsList;
          const savedUser = await user.save();
          return {
            success: true,
            message: "Successfully deleted a NFT",
            data: { user: savedUser },
          };
        }
      } else {
        return {
          success: false,
          message: "Something went wrong when deleting nft from user",
        };
      }
    } else {
      return {
        success: false,
        message: "Cannot find nft with specified id",
      };
    }
  } catch (err) {
    return {
      success: false,
      message: "Something went wrong when deleting an NFT",
    };
  }
};

export const listNFTs = async (userId: string) => {
  try {
    const user = await User.findOne({ _id: userId })
      .populate([{ path: "metaNfts" }, { path: "nftClaimed" }])
      .exec();
    return {
      success: true,
      data: { metaNFTs: user?.metaNfts, claimed: user?.nftClaimed },
    };
  } catch (err) {
    return {
      success: false,
      message: "Something went wrong when deleting an NFT",
    };
  }
};
