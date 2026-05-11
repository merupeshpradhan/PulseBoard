import express from "express";
import cors from "cors";

import authRoutes from "./modules/auth/auth.routes.js";
import pollRoutes from "./modules/poll/poll.routes.js";

import errorMiddleware from "./common/middleware/error.middleware.js";
import ApiError from "./common/utils/api-error.js";

const app = express();

// Middleware
app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/polls", pollRoutes);

// Invalid route handler
app.all(/.*/, (req, res) => {
  throw ApiError.notFound(`Route ${req.originalUrl} not found`);
});

// Global error middleware
app.use(errorMiddleware);

export default app;
