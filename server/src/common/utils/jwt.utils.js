import jwt from "jsonwebtoken";

// Generate JWT token
const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    // expiresIn: process.env.JWT_EXPIRES_IN || "1m",

  });
};

// Verify JWT token
const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

export { generateAccessToken, verifyAccessToken };
