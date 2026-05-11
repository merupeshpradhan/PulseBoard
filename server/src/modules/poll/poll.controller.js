import * as pollService from "./poll.service.js";

import ApiResponse from "../../common/utils/api-response.js";

// Create poll
const createPoll = async (req, res) => {
  const poll = await pollService.createPoll(req.body, req.user.id);

  ApiResponse.created(res, "Poll created successfully", poll);
};

// Get poll
const getPoll = async (req, res) => {
  const poll = await pollService.getPoll(req.params.id);

  ApiResponse.ok(res, "Poll fetched successfully", poll);
};

// Submit response
const submitResponse = async (req, res) => {
  const io = req.app.get("io");

  const poll = await pollService.submitResponse(
    req.params.id,
    req.body,
    req.user,
    io,
  );

  ApiResponse.ok(res, "Response submitted successfully", poll);
};

// Analytics
const getAnalytics = async (req, res) => {
  const analytics = await pollService.getAnalytics(req.params.id);

  ApiResponse.ok(res, "Analytics fetched successfully", analytics);
};

// Publish results
const publishResults = async (req, res) => {
  const poll = await pollService.publishResults(req.params.id);

  ApiResponse.ok(res, "Results published successfully", poll);
};

// Public results
const getPublicResults = async (req, res) => {
  const results = await pollService.getPublicResults(req.params.id);

  ApiResponse.ok(res, "Results fetched successfully", results);
};

export {
  createPoll,
  getPoll,
  submitResponse,
  getAnalytics,
  publishResults,
  getPublicResults,
};
