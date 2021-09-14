const mongoose = require("mongoose");

const chatListSchema = mongoose.Schema({
  participents: [{ type: mongoose.Types.ObjectId, ref: "users" }],
  chats: [{ type: mongoose.Types.ObjectId, ref: "chats" }],
});

const ChatList = new mongoose.model("chats", chatListSchema);

module.exports = ChatList;
