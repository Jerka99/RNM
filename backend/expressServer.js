const express = require("express");
const cors = require("cors");
const app = express();
// set port, listen for requests
app.enable("trust proxy", 1);

require("dotenv").config();
const {handleConnection} = require('./socketFunctions')
const axios = require('axios')
const userRoute = require("./routes/users");
const loginRoute = require("./routes/login");
const signupRoute = require("./routes/signup");
const relationsRoute = require("./routes/relations");
const friendsRoute = require("./routes/friends");
const messagesRoute = require("./routes/messages");
const checkServerRoute = require("./routes/checkServer");
// const onlineStatus = require("./routes/onlinestatus");

const { Server } = require("socket.io");
const { authorizeUser } = require("./controllers/authorizeUser");

const PORT = process.env.BACKEND_URL == "http://localhost:4000" ? 4000 : 443;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

const corsConfig = {
  origin: [process.env.ORIGIN_URL],
  methods: ["OPTIONS", "GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
};

const io = new Server(server, {
  cors: corsConfig,
});

app.use(cors(corsConfig));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/users", userRoute);
app.use("/", loginRoute);
app.use("/signup", signupRoute);
app.use("/relations", relationsRoute);
app.use("/friends", friendsRoute);
app.use("/", messagesRoute);
app.use("/checkserver", checkServerRoute);
// app.use("/", onlineStatus);

io.use(authorizeUser);

io.on("connect", (socket) => {
  axios.patch(`${process.env.BACKEND_URL}/messages`, {receiver:socket.user.email, status:1})
    .then(response => {
      // console.log(response.data.message);
    })
    .catch(error => {
      console.error('Error:', error);
      console.log({ error: 'Could not save data' });
    });

  handleConnection(socket, io)
});
