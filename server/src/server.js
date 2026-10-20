require("dotenv").config();

const http = require("http"),
  { Server } = require("socket.io"),
  jwt = require("jsonwebtoken"),
  app = require("./app"),
  connectDB = require("./config/db"),
  User = require("./models/User");

async function start() {
  await connectDB();
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Authentication required"));
      const payload = jwt.verify(token, process.env.JWT_SECRET),
        user = await User.findById(payload.sub);
      if (!user) return next(new Error("User not found"));
      socket.user = user;
      next();
    } catch (e) {
      next(new Error("Invalid socket token"));
    }
  });

  io.on("connection", (s) => {
    if (s.user.role === "admin") s.join("admins");
    else s.join(`user:${s.user._id}`);
    s.emit("connected", { success: true, userId: String(s.user._id) });
  });

  app.set("io", io);
  const port = process.env.PORT || 5000;
  server.listen(port, () => console.log(`Portal API running on port ${port}`));
}

start().catch((e) => {
  console.error("Server startup failed:", e);
  process.exit(1);
});
