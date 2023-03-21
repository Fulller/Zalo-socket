const io = require("socket.io")(3002, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://admin.socket.io",
      "https://zalohe.vercel.app",
    ],
  },
});
const { instrument } = require("@socket.io/admin-ui");

io.on("connection", (socket) => {
  console.log("Client connect with id " + socket.id);
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
  socket.on("wanttobefriend", (data) => {
    io.to(data.userName).to(data.userNameFriend).emit("requestfriend", null);
  });
  socket.on("acceptrequestfriend", (data) => {
    io.to(data.userName)
      .to(data.userNameFriend)
      .emit("acceptedrequestfriend", null);
  });
  socket.on("updateinfo", (data) => {
    for (let friend of data.friends) {
      io.to(friend.userName).emit("friendupdateinfo", data.userName);
    }
  });
});
instrument(io, {
  auth: false,
});
