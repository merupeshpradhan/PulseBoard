import { Router } from "express";

import * as controller from "./poll.controller.js";

import { authenticate } from "../auth/auth.middleware.js";

import validate from "../../common/middleware/validate.middleware.js";

import CreatePollDto from "./dto/create-poll.dto.js";
import SubmitResponseDto from "./dto/submit-response.dto.js";

const router = Router();

// Create poll
router.post(
  "/create",
  authenticate,
  validate(CreatePollDto),
  controller.createPoll,
);

// Public poll route
router.get("/:id", controller.getPoll);

// Submit response
router.post(
  "/submit/:id",
  validate(SubmitResponseDto),
  controller.submitResponse,
);

// Analytics route
router.get("/analytics/:id", authenticate, controller.getAnalytics);

// Publish results
router.patch("/publish/:id", authenticate, controller.publishResults);

export default router;
