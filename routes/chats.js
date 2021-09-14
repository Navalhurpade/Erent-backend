const express = require("express");
const Chat = require("../models/Chat");
const router = express.Router();

router.post("/", async (req, res) => {
  //Same query Working fine in mogodb shell and mompass but not working here !

  // const quary = {
  //   $or: [{ from: { $eq: `${userId}` } }, { to: { $eq: `${userId}` } }],
  // };
  // const messages = await Chat.find(quary);

  const { userId } = req.body;

  if (!userId) return res.status(400).send({ error: "No user Id found" });
  const allMessages = await Chat.find({}).populate("from to");

  //filtering all messages relevent to reqested user !
  const filteredMessage = allMessages.filter((m) =>
    m.participents.includes(userId)
  );

  let data = [];
  let users = {}; //will hold all uniqe users

  //Frist exrqacting all UNIQE users from messages
  filteredMessage.map((m) => {
    users[m.from?._id] = m.from;
    users[m.to?._id] = m.to;
  });

  //removeing self
  delete users[userId];

  //then looping over all users and extracting all chats revent to them !
  for (let key in users) {
    const usersMessages = filteredMessage.filter((m) =>
      m.participents.includes(users[key]._id)
    );

    const chatsWithThisUser = {
      withUser: users[key],
      chats: [...usersMessages],
    };
    data.push(chatsWithThisUser);
  }

  res.send(data);
});

module.exports = router;
