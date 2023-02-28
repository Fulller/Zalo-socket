const io = require("socket.io")(3002, {
  cors: {
    origin: ["http://localhost:3000", "https://admin.socket.io"],
  },
});
const { instrument } = require("@socket.io/admin-ui");

io.on("connection", (socket) => {
  socket.on("joinrooms", (roomIds) => {
    roomIds &&
      roomIds.forEach(async (roomId) => {
        await socket.join(roomId);
      });
  });
  socket.on("sendMessageToFriend", (data) => {
    io.to(data.receiveId).to(data.senderId).emit("receiveMessageFromFriend", {
      conversationId: data.conversationId,
    });
  });
});
instrument(io, {
  auth: false,
});
