const mongoose = require("mongoose");
const schema = new mongoose.Schema(
  {
    bookId: { type: String, required: true, unique: true, index: true },
    authorId: { type: String, required: true, index: true },
    title: { type: String, required: true, trim: true },
    isbn: String,
    genre: String,
    publicationDate: Date,
    status: { type: String, default: "In Production" },
    mrp: { type: Number, default: 0 },
    authorRoyaltyPerCopy: { type: Number, default: 0 },
    totalCopiesSold: { type: Number, default: 0 },
    totalRoyaltyEarned: { type: Number, default: 0 },
    royaltyPaid: { type: Number, default: 0 },
    royaltyPending: { type: Number, default: 0 },
    lastRoyaltyPayoutDate: Date,
    printPartner: String,
    availableOn: [String],
  },
  { timestamps: true },
);
module.exports = mongoose.model("Book", schema);
