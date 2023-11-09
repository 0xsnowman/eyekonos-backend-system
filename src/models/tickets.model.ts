import mongoose from "mongoose";

const TicketsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Events",
    required: true,
  },
  originalTicketId: {
    type: String,
    required: true,
  },
  eventId: {
    type: String,
    required: true,
  },
  seatNumber: {
    type: Number,
    default: 0,
  },
  claimCode: {
    type: String,
    required: true,
  },
  recipientEmail: {
    type: String,
    required: true,
  },
  resourceURL: {
    type: String,
    required: true,
  },
  cost: {
    type: String,
    required: true,
  },
  ticketType: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  claimed: {
    type: Array,
    default: [],
  },
  nfts: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "NFT",
    default: [],
  },
  mintedMetadataNFTs: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "NFT",
    default: [],
  },
});

export const Tickets = mongoose.model("Tickets", TicketsSchema);
