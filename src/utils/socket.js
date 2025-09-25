const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");
const ConnectionRequest = require("../models/connectionRequest");
const { instrument } = require("@socket.io/admin-ui");

const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("$"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: true, // Allow all origins for now to debug
      credentials: true,
      methods: ["GET", "POST", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "Origin", "Accept"],
      transports: ['websocket', 'polling']
    },
    pingTimeout: 60000, // Increase ping timeout
    pingInterval: 25000, // Increase ping interval
  });

  instrument(io, {
    auth: false,
    mode: "development",
  });


  io.on("connection", (socket) => {
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      console.log(firstName + " joined Room : " + roomId);
      socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      async ({ firstName, lastName, userId, targetUserId, text }) => {
        // Save messages to the database
        try {
          const roomId = getSecretRoomId(userId, targetUserId);
          console.log(firstName + " " + text);

          // TODO: Check if userId & targetUserId are friends

          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });

          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }

          chat.messages.push({
            senderId: userId,
            text,
          });

          await chat.save();
          io.to(roomId).emit("messageReceived", { firstName, lastName, text });
        } catch (err) {
          console.log(err);
        }
      }
    );
 // Video call functionality
    socket.on("joinVideoRoom", ({ firstName, userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      console.log(firstName + " joined Video Room: " + roomId);
      socket.join(roomId);
    });

    socket.on("callUser", ({ userId, targetUserId, firstName, lastName, signal }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      console.log(`${firstName} ${lastName} is calling user ${targetUserId}`);
      
      io.to(roomId).emit("callUser", {
        from: userId,
        firstName,
        lastName,
        signal,
      });
    });

    socket.on("answerCall", ({ userId, targetUserId, firstName, lastName, signal }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      console.log(`${firstName} ${lastName} answered call from ${targetUserId}`);
      
      io.to(roomId).emit("callAccepted", {
        from: userId,
        signal,
      });

      io.to(roomId).emit("userSignal", {
        from: userId,
        signal,
      });
    });

    socket.on("endCall", ({ userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      console.log(`Call ended between ${userId} and ${targetUserId}`);
      
      io.to(roomId).emit("callEnded");
    });

 // Video call functionality
 socket.on("joinVideoRoom", ({ firstName, userId, targetUserId }) => {
  const roomId = getSecretRoomId(userId, targetUserId);
  console.log(firstName + " joined Video Room: " + roomId);
  socket.join(roomId);
});

socket.on("callUser", ({ userId, targetUserId, firstName, lastName, signal }) => {
  const roomId = getSecretRoomId(userId, targetUserId);
  console.log(`${firstName} ${lastName} is calling user ${targetUserId}`);
  
  io.to(roomId).emit("callUser", {
    from: userId,
    firstName,
    lastName,
    signal,
  });
});

socket.on("answerCall", ({ userId, targetUserId, firstName, lastName, signal }) => {
  const roomId = getSecretRoomId(userId, targetUserId);
  console.log(`${firstName} ${lastName} answered call from ${targetUserId}`);
  
  io.to(roomId).emit("callAccepted", {
    from: userId,
    signal,
  });

  io.to(roomId).emit("userSignal", {
    from: userId,
    signal,
  });
});

socket.on("endCall", ({ userId, targetUserId }) => {
  const roomId = getSecretRoomId(userId, targetUserId);
  console.log(`Call ended between ${userId} and ${targetUserId}`);
  
  io.to(roomId).emit("callEnded");
});


    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;