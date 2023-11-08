import mongoose from "mongoose";

const AccountAdminsSchema = new mongoose.Schema({
  admins: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    default: [],
  },
});

export const AccountAdmins = mongoose.model(
  "AccountAdmins",
  AccountAdminsSchema
);
