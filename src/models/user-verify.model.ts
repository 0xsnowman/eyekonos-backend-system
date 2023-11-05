import mongoose from "mongoose";

const UserVerifySchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const UserVerify = mongoose.model("UserVerify", UserVerifySchema);
