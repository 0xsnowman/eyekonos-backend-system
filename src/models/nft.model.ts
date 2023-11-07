import mongoose from "mongoose";

const NFTSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  metadata: {
    type: String,
    required: true,
  },
  traits: {
    type: Array,
    default: [],
  },
  image: {
    type: String,
    required: true,
  },
});

export const NFT = mongoose.model("NFT", NFTSchema);
