module.exports.authorizeUser = (socket, next) => {
  if (socket.request.session.user) {
    console.log('...socket.request.session.user[0]',...socket.request.session.user[0])
    socket.user = { ...socket.request.session.user[0] };
    next();
  } else {
    next(new Error("Not authorized"));
  }
};
