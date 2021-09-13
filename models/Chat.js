const mongoose = require("mongoose");

const chatSchema = mongoose.Schema({
  participents: [{ type: mongoose.Types.ObjectId, ref: "users" }],

  from: { type: mongoose.Types.ObjectId, ref: "users" },
  to: { type: mongoose.Types.ObjectId, ref: "users" },
  message: String,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Chat = new mongoose.model("chats", chatSchema);

module.exports = Chat;
