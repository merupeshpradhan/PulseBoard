import Poll from "./poll.model.js";

import ApiError from "../../common/utils/api-error.js";

// -----------------------------
// CREATE POLL
// -----------------------------
// This function:
// 1. Creates new poll
// 2. Saves poll creator id
// -----------------------------
const createPoll = async (data, userId) => {
  // create poll in database
  const poll = await Poll.create({
    ...data,

    createdBy: userId,
  });

  // return created poll
  return poll;
};

// -----------------------------
// GET SINGLE POLL
// -----------------------------
// This function:
// 1. Finds poll by id
// 2. Returns poll data
// 3. DOES NOT block expired polls
//
// IMPORTANT:
// Frontend needs poll data
// even after expiry.
//
// Frontend will show:
// ✔ expired message
// ✔ disabled voting
// ✔ hidden submit button
// -----------------------------
const getPoll = async (pollId) => {
  // find poll by id
  const poll = await Poll.findById(pollId);

  // check poll exists
  if (!poll) {
    throw ApiError.notFound("Poll not found");
  }

  // IMPORTANT:
  // Do NOT throw expiry error here
  //
  // OLD CODE REMOVED:
  //
  // if (new Date() > new Date(poll.expiresAt)) {
  //   throw ApiError.badRequest("Poll expired");
  // }
  //
  // Frontend handles expiry UI

  // return poll data
  return poll;
};

// -----------------------------
// GET MY POLLS
// -----------------------------
// Returns only logged-in
// user's polls
// -----------------------------
const getMyPolls = async (userId) => {
  const polls = await Poll.find({
    createdBy: userId,
  }).sort({
    createdAt: -1,
  });

  return polls;
};

// -----------------------------
// SUBMIT RESPONSE
// -----------------------------
// This function:
// 1. Validates poll
// 2. Checks expiry
// 3. Prevents duplicate voting
// 4. Supports anonymous voting
// 5. Saves responses
// 6. Sends realtime updates
// -----------------------------
const submitResponse = async (
  pollId,

  data,

  user,

  io,
) => {
  // find poll
  const poll = await Poll.findById(pollId);

  // check poll exists
  if (!poll) {
    throw ApiError.notFound("Poll not found");
  }

  // -----------------------------
  // CHECK EXPIRY
  // prevents voting after expiry
  // -----------------------------
  if (new Date() > new Date(poll.expiresAt)) {
    throw ApiError.badRequest("Poll expired");
  }

  // -----------------------------
  // CHECK AUTH REQUIREMENT
  // -----------------------------
  if (!poll.allowAnonymous && !user) {
    throw ApiError.unauthorized("Login required to submit response");
  }

  // -----------------------------
  // PREVENT DUPLICATE RESPONSE
  // only for logged-in users
  // -----------------------------
  if (user) {
    const alreadySubmitted = poll.responses.find(
      (response) => response.user?.toString() === user.id.toString(),
    );

    if (alreadySubmitted) {
      throw ApiError.badRequest("You already submitted this poll");
    }
  }

  // -----------------------------
  // SAVE RESPONSE
  // -----------------------------
  poll.responses.push({
    user: user?.id || null,

    answers: data.answers,
  });

  // save database
  await poll.save();

  // -----------------------------
  // REALTIME SOCKET EVENT
  // updates all connected users
  // -----------------------------
  io.emit(
    "poll-response-updated",

    {
      pollId,

      totalResponses: poll.responses.length,
    },
  );

  // return updated poll
  return poll;
};

// -----------------------------
// GET ANALYTICS
// -----------------------------
// This function:
// 1. Counts votes
// 2. Generates analytics
// 3. Returns structured data
// -----------------------------
const getAnalytics = async (pollId) => {
  // find poll
  const poll = await Poll.findById(pollId);

  // check poll exists
  if (!poll) {
    throw ApiError.notFound("Poll not found");
  }

  // create analytics array
  const analytics = poll.questions.map((question) => {
    // object for vote count
    const optionCounts = {};

    // initialize options
    question.options.forEach((option) => {
      optionCounts[option] = 0;
    });

    // count votes
    poll.responses.forEach((response) => {
      response.answers.forEach((answer) => {
        if (answer.questionId.toString() === question._id.toString()) {
          optionCounts[answer.selectedOption] += 1;
        }
      });
    });

    // return question analytics
    return {
      question: question.question,

      optionCounts,
    };
  });

  // return final analytics
  return {
    totalResponses: poll.responses.length,

    analytics,
  };
};

// -----------------------------
// GET PUBLIC RESULTS
// -----------------------------
// Returns results only if
// poll is published
// -----------------------------
const getPublicResults = async (pollId) => {
  // find poll
  const poll = await Poll.findById(pollId);

  // check poll exists
  if (!poll) {
    throw ApiError.notFound("Poll not found");
  }

  // check published
  if (!poll.isPublished) {
    throw ApiError.forbidden("Results not published yet");
  }

  return poll;
};

// -----------------------------
// PUBLISH RESULTS
// -----------------------------
// Makes poll results public
// -----------------------------
const publishResults = async (pollId) => {
  // update poll
  const poll = await Poll.findByIdAndUpdate(
    pollId,

    {
      isPublished: true,
    },

    {
      new: true,
    },
  );

  // check poll exists
  if (!poll) {
    throw ApiError.notFound("Poll not found");
  }

  // return updated poll
  return poll;
};

// export all functions
export {
  createPoll,
  getPoll,
  getMyPolls,
  submitResponse,
  getAnalytics,
  getPublicResults,
  publishResults,
};
