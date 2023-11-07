import mongoose from "mongoose";

const UploadSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Events",
  },
  name: {
    type: String,
    required: true,
  },
  file: {
    type: String,
    required: false,
  },
  uploadedTime: {
    type: Date,
    default: Date.now,
  },
});

export const Upload = mongoose.model("Upload", UploadSchema);
