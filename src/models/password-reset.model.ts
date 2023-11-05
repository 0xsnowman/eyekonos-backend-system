import mongoose from "mongoose";

const PasswordResetSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  verifyToken: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const PasswordReset = mongoose.model(
  "PasswordReset",
  PasswordResetSchema
);
