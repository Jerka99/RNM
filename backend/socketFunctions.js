const axios = require("axios");
const users = {};
const handleConnection = (socket, io) => {
  for (let [id, user] of io.of("/").sockets) {
    //finds all online on server

    let unique = user.user.email;
    users[unique] = {
      userId: id,
      name: socket.user.name,
      secondname: socket.user.secondname,
      email: user.user.email,
    };
  }
  socket.emit("users", users);

  socket.broadcast.emit("seen", {
    time: 1,
  });

  socket.broadcast.emit("user connected", {
    userId: socket.id,
    user: socket.user.name + " " + socket.user.secondname,
    email: socket.user.email,
  });

  socket.on("private message", (data) => {
    console.log("privaate message", data.to, data.sender);
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

  socket.on("seen", (data) => {
    console.log("data", data);
    socket.to(users[data.to]?.userId).emit("seen", data);
  });

  socket.on("disconnect", () => {
    io.emit("remove user", {
      user: socket.user.email,
      time: Math.floor(Date.now() / 1000),
    });
    delete users[socket.user.email];
    axios
      .patch(`${process.env.BACKEND_URL}/users`, {
        email: socket.user.email,
        lastActivity: Math.floor(Date.now() / 1000),
      })
      .then((response) => {
        // Handle the response from the server
        // console.log(response.data.message);
      })
      .catch((error) => {
        console.error("Error:", error);
        console.log({ error: "Could not save data" });
      });
    console.log("user disconnected", socket.user.email);
  });
};

module.exports = { handleConnection };
