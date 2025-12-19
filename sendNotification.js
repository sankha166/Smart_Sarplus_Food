let io;
module.exports = {
  init: (server) => {
    io = require("socket.io")(server, { cors: { origin: "*" } });
  },
  notify: (message) => {
    if (io) io.emit("notification", message);
    console.log("🔔 Notification:", message);
  }
};
