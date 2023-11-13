import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  settingsKey: {
    type: String,
    required: false,
  },
  newSettings: {
    type: Array,
    required: false,
  },
  tickets: {
    type: Array,
    required: false,
  },
  nftClaimed: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "NFT" }],
    default: [],
  },
  metaNfts: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "NFT" }],
    default: [],
  },
  eventsCreated: {
    type: Array,
    required: false,
  },
  eventsCollaborated: {
    type: Array,
    required: false,
  },
  eventWallet: {
    type: String,
    required: false,
  },
  lastNftEmailUpdate: {
    type: Date,
    default: Date.now,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const User = mongoose.model("User", UserSchema);
