// Load environment variables
import "dotenv/config";

// Express app
import app from "./src/app.js";

// Database connection
import connectDB from "./src/common/config/db.js";

// HTTP package for socket.io later
import http from "http";

// Socket.io
import { Server } from "socket.io";

const PORT = process.env.PORT || 4000;

// Create HTTP server
const server = http.createServer(app);

// Initialize socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
  },
});

// Store io globally
app.set("io", io);

// Socket connection
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });
});

// Start server
const start = async () => {
  try {
    // Connect database
    await connectDB();

    // Start backend server
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.log("Server start failed", err.message);
  }
};

start();
