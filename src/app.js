require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");

// ✅ Allow local frontend during development
app.use(
  cors({
    origin: ["http://localhost:5173", "https://connectify-frontend-snowy.vercel.app/"], // frontend is local for now
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());

// Routers
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const initializeSocket = require("./utils/socket");
const chatRouter = require("./routes/chat");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", chatRouter);
app.get("/", (req, res) => {
  res.send("Backend is running on Render ✅");
});

const server = http.createServer(app);
initializeSocket(server);

connectDB()
  .then(() => {
    console.log("Database connection established...");
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`✅ Server is successfully listening on port ${PORT}...`);
    });
  })
  .catch((err) => {
    console.error("❌ Database cannot be connected!!", err);
  });