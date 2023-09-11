const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const userRoute = require("./routes/users");
const loginRoute = require("./routes/login");
const signupRoute = require("./routes/signup");
const relationsRoute = require("./routes/relations");
const friendsRoute = require("./routes/friends");
const messagesRoute = require("./routes/messages");
const { Server } = require("socket.io");
const {
  sessionMiddleware,
  wrap,
  corsConfig,
} = require("./controllers/serverController");
const { email } = require("./expressValidationObject");
const { authorizeUser } = require("./controllers/authorizeUser");

// set port, listen for requests
app.enable('trust proxy');

const PORT = 4000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

const io = new Server(server, {
  cors: corsConfig,
});

app.use(cors(corsConfig));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessionMiddleware);
app.use("/users", userRoute);
app.use("/", loginRoute);
app.use("/signup", signupRoute);
app.use("/relations", relationsRoute);
app.use("/friends", friendsRoute);
app.use("/messages", messagesRoute);

io.use(wrap(sessionMiddleware));
io.use(authorizeUser);

const users = {};

io.on("connect", (socket) => {
  for (let [id, user] of io.of("/").sockets) {
    //finds all online on server
    let boolean = Object.values(users).find((el) => {
      return el.email == user.user.email;
    }); //to avoid same object in array if already logged in
    let unique = user.user.email;
    if (!boolean) {
      users[unique] = {
        userId: id,
        name: socket.user.name,
        secondname: socket.user.secondname,
        email: user.user.email,
      };
    }
  }
  socket.emit("users", users);

  console.log(users, socket.id);

  socket.broadcast.emit("user connected", {
    userId: socket.id,
    user: socket.user.name + " " + socket.user.secondname,
    email: socket.user.email,
  });

  socket.on("private message", (data) => {
    socket
      .to(users[data.to]?.userId)
      .emit("private message", { msg: data.msg, sender: data.sender });
  });

  socket.on("invitation", (data) => {
    socket.to(users[data.receiver]?.userId).emit("invitation", data);
  });

  socket.on("typing", (data) => {
    socket.to(users[data.to]?.userId).emit("typing", data);
  });

  socket.on("disconnect", () => {
    io.emit("remove user", socket.id);
    Object.values(users).forEach((el) => {
      console.log(el, socket.id);
      if (el.userId == socket.id) delete users[el.email];
    });
    console.log("user disconnected", socket.id);
  });
});
