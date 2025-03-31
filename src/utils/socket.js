const socket = require("socket.io");
const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",

      credentials: true,
    },
  });
  io.on("connection", (socket) => {
    //handle events

    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const roomId = [userId, targetUserId].sort().join("_");

      console.log(firstName + "joining room : " + roomId);
      socket.join(roomId);
    });

    socket.on("sendMessage", ({ firstName, userId, targetUserId, text }) => {
      const roomId = [userId, targetUserId].sort().join("_");
      console.log(firstName + " " + text);
      io.to(roomId).emit("receiveMessage", { firstName, text });
    });

    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
