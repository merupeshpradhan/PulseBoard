// 1. Force Node.js to use Google DNS to fix MongoDB connection errors
import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import mongoose from "mongoose";

// 2. Create a function to link our app to the MongoDB database
const connectDB = async () => {
  // Try to connect using the secret URL from our .env file
  const conn = await mongoose.connect(process.env.MONGODB_URI);

  // 3. Log a success message so we know it worked!
  console.log(`MongoDB Connected: ${conn.connection.host}`);
};

// 4. Share this function so we can use it in server.js
export default connectDB;
