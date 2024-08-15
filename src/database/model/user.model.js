const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  isVerified: {
    type: Boolean,
    required: true,
    default: false,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  expenses: [{ type: mongoose.Types.ObjectId, ref: "Expense", requird: true }],
  income: [{ type: mongoose.Types.ObjectId, ref: "Income", requird: true }],
  friends: [{ type: mongoose.Types.ObjectId, ref: "User" }],
});

const friendRequestSchema = new Schema({
  sender: { type: mongoose.Types.ObjectId, ref: "User", required: true }, // The user who sends the request
  receiver: { type: mongoose.Types.ObjectId, ref: "User", required: true }, // The user who receives the request
  status: {
    type: String,
    enum: ["pending", "accepted", "declined"],
    default: "pending",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  is_deleted: { type: Boolean, default: false },
});

const FriendRequest = mongoose.model("FriendRequest", friendRequestSchema);

const User = mongoose.model("User", userSchema);

module.exports = { User, FriendRequest };
