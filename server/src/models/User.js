const mongoose = require("mongoose");
const schema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["author", "admin"],
      default: "author",
      index: true,
    },
    authorId: { type: String, default: null, index: true },
    phone: String,
    city: String,
    joinedDate: Date,
  },
  { timestamps: true },
);
module.exports = mongoose.model("User", schema);
