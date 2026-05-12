import { Router } from "express";

import * as controller from "./poll.controller.js";

import { authenticate } from "../auth/auth.middleware.js";

import optionalAuth from "../auth/optional-auth.middleware.js";

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

// Public results
router.get("/results/:id", controller.getPublicResults);

// Submit response
router.post(
  "/submit/:id",
  optionalAuth,
  validate(SubmitResponseDto),
  controller.submitResponse,
);

// Analytics
router.get("/analytics/:id", authenticate, controller.getAnalytics);

// Publish results
router.patch("/publish/:id", authenticate, controller.publishResults);

// Own poll
router.get("/my-polls", authenticate, controller.getMyPolls);

// Public poll
router.get("/:id", controller.getPoll);

export default router;
