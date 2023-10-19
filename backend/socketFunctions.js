const users = {};
const handleConnection = (socket, io) =>{
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
        console.log("ovoodeee", users[data.receiver]);
        socket.to(users[data.receiver]?.userId).emit("invitation", data);
      });
    
      socket.on("typing", (data) => {
        socket.to(users[data.to]?.userId).emit("typing", data);
      });
    
      socket.on("disconnect", () => {
        io.emit("remove user", socket.id);
        Object.values(users).forEach((el) => {
          if (el.userId == socket.id) delete users[el.email];
        });
        console.log("user disconnected", socket.id);
      });
}

module.exports = {handleConnection}