const mongoose = require("mongoose");
const categories = [
  "Royalty & Payments",
  "ISBN & Metadata Issues",
  "Printing & Quality",
  "Distribution & Availability",
  "Book Status & Production Updates",
  "General Inquiry",
];
const priorities = ["Critical", "High", "Medium", "Low"];
const statuses = ["Open", "In Progress", "Resolved", "Closed"];
const replySchema = new mongoose.Schema(
  {
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    authorName: { type: String, required: true },
    role: { type: String, enum: ["author", "admin"], required: true },
    message: { type: String, required: true, trim: true },
    internal: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const schema = new mongoose.Schema(
  {
    ticketNumber: { type: String, unique: true, index: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    authorId: { type: String, required: true, index: true },
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", default: null },
    bookTitle: { type: String, default: "General / Account Level" },
    subject: { type: String, required: true, trim: true, maxlength: 160 },
    description: { type: String, required: true, trim: true, maxlength: 10000 },
    category: { type: String, enum: categories, default: "General Inquiry" },
    priority: { type: String, enum: priorities, default: "Medium" },
    status: { type: String, enum: statuses, default: "Open", index: true },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    aiDraft: { type: String, default: "" },
    attachmentName: { type: String, default: "" },
    replies: [replySchema],
    lastActivityAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true },
);

schema.pre("validate", function (next) {
  if (!this.ticketNumber)
    this.ticketNumber = `BL-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  next();
});

schema.index({ status: 1, priority: 1, createdAt: -1 });
const Ticket = mongoose.model("Ticket", schema);
Ticket.categories = categories;
Ticket.priorities = priorities;
Ticket.statuses = statuses;
module.exports = Ticket;
