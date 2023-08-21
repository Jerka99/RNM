const session = require("express-session");

const sessionMiddleware = session({
  key: "userId",
  secret: "mysecretkey",
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 1000 * 60 * 60 * 24,
    httpOnly: false, //set false if you want to change the cookie using JavaScipt
    // sameSite: "None",
    // secure: true,
    // maxAge: 100000,
  },
});


// Most existing Express middleware modules should be compatible 
// with Socket.IO, you just need a little wrapper 
// function to make the method signatures match
const wrap = expressMiddleware => (socket, next) =>{
    expressMiddleware(socket.request, {}, next)
}

const corsConfig = {
    origin: ["http://localhost:5173"],
    methods: ["OPTIONS", "GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials:true
  }

module.exports = {sessionMiddleware, wrap, corsConfig};
