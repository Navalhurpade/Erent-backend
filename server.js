require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cloudinary = require("cloudinary").v2;
const socketIo = require("socket.io");

const auth = require("./routes/auth.js");
const post = require("./routes/posts");
const Chat = require("./models/Chat.js");
const chats = require("./routes/chats");

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Working !!!");
});

app.use("/auth", auth);
app.use("/posts", post);
app.use("/chats", chats);

mongoose.connect(process.env.DATABASE_URL, (err) => {
  if (!err) {
    console.log("Connected to mpongodb cluster");
    //Configuring Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_AIP_SECRET,
    });
  } else console.log(err);
});

const Server = app.listen(process.env.PORT, (res) => {
  console.log(`Server is Running at port ${process.env.PORT}`);
});

//giving the server instance to socket io
const io = socketIo(Server, {
  pingTimeout: 10000,
  connectTimeout: 10000,
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    Headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
});

class User {
  constructor(user, socketId) {
    this.id = user._id;
    this.socketId = socketId;

    this.getUserId = function () {
      return this.id;
    };

    this.getSocketId = () => {
      return this.socketId;
    };
  }
}

let userMap = new Map();

io.on("connection", (client) => {
  client.on("user-joined", (user) => {
    if (user) {
      userMap.set(user._id, new User(user, client.id));
      console.log("user joined");
    } else console.log("falsy user");
  });

  client.on("send-message", (message) => {
    if (!message) return console.log("falsy message");
    const newMasage = new Chat(message);

    console.log("got", message);

    newMasage.save((err) => {
      if (err) return console.log(err);
    });

    //if reciver is online broadcasting that message !
    if (userMap.has(message.to._id)) {
      client.broadcast
        .to(userMap.get(message.to._id).socketId)
        .emit("message-recive", message);
    }
  });

  client.on("disconnect", (user) => {
    console.log("disconnected");
    userMap.delete(user._id);
  });
});
