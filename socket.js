const socket = io("http://localhost:5000");
socket.on("notification", (msg) => {
  alert("🔔 " + msg);
});
