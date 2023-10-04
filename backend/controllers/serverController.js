const session = require("express-session");
const mysqlStore = require("express-mysql-session")(session);

const options = {
  host: process.env.MYSQL_HOST,
  database: process.env.MYSQL_DATABASE,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
};

const sessionStore = new mysqlStore(options);

const cookieOptions = {
  secure: process.env.ORIGIN_URL == 'https://frontend-7vx8.onrender.com',
  sameSite: process.env.ORIGIN_URL == 'https://frontend-7vx8.onrender.com' ? "None" : "Lax",
}

const sessionMiddleware = session({
  key: "userId",
  secret: "mysecretkey",
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    expires: 1000 * 60 * 60 * 24,
    httpOnly: true, //set false if you want to change the cookie using JavaScipt
    secure: cookieOptions.secure,
    sameSite: cookieOptions.sameSite,
    domain: process.env.BACKEND_DOMAIN,
    path:'/'
    // maxAge: 100000,
  },
});

// Most existing Express middleware modules should be compatible
// with Socket.IO, you just need a little wrapper
// function to make the method signatures match
// const wrap = (expressMiddleware) => (socket, next) => {
//   expressMiddleware(socket.request, {}, next);
// };

const corsConfig = {
  origin: [process.env.ORIGIN_URL],
  methods: ["OPTIONS", "GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
};

module.exports = { sessionMiddleware, corsConfig };
