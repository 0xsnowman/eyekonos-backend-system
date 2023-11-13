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
  image: {
    type: String,
    required: true,
  },
  metadata: {
    type: String,
    default: "",
  },
  traits: {
    type: Array,
    default: [],
  },
  status: {
    type: String,
    default: "meta",
  },
});

export const NFT = mongoose.model("NFT", NFTSchema);
