const jwt = require("jsonwebtoken");
const secretKey = "secret-key";

module.exports.authorizeUser = (socket, next) => {
  const token = socket.handshake.query.token

  if (token !== undefined) {
    jwt.verify(token, secretKey, (err, decoded) => {
      if(err) return next(new Error(err));
      const { name, secondname, email } = decoded;
      socket.user = { name, secondname, email };
      next();
    });
  } else {
    next(new Error("Not authorized"));
  }
};
