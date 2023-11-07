import mongoose from "mongoose";

const EventsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  location: {
    type: String,
    required: true,
  },
  apiKey: {
    type: String,
    required: true,
  },
  urlSlug: {
    type: String,
    default: "",
  },
  settings: {
    type: Array,
    required: false,
  },
  collaborators: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    default: [],
  },
  nftOrganization: {
    type: String,
    required: false,
  },
  nftDistribution: {
    type: String,
    required: false,
  },
  ticketSupply: {
    type: Number,
    default: 0,
  },
  nftContract: {
    type: String,
    required: false,
  },
  uploadStorage: {
    type: String,
    required: true,
  },
  exclusiveUploads: {
    type: Array,
    required: false,
  },
  lastTicketClassUpdate: {
    type: Date,
    default: Date.now,
  },
});

export const Events = mongoose.model("Events", EventsSchema);
