module.exports.authorizeUser = (socket, next) => {
  if (socket.request.session.user) {
    socket.user = { ...socket.request.session.user[0] };
    next();
  } else {
    next(new Error("Not authorized"));
  }
};
