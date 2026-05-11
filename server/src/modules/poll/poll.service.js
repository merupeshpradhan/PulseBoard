import Poll from "./poll.model.js";

import ApiError from "../../common/utils/api-error.js";

// Create poll
const createPoll = async (data, userId) => {
  const poll = await Poll.create({
    ...data,
    createdBy: userId,
  });

  return poll;
};

// Get single poll
const getPoll = async (pollId) => {
  const poll = await Poll.findById(pollId);

  if (!poll) {
    throw ApiError.notFound("Poll not found");
  }

  // Expiry validation
  if (new Date() > new Date(poll.expiresAt)) {
    throw ApiError.badRequest("Poll expired");
  }

  return poll;
};

// Submit response
const submitResponse = async (pollId, data, user, io) => {
  const poll = await Poll.findById(pollId);

  if (!poll) {
    throw ApiError.notFound("Poll not found");
  }

  // Expiry check
  if (new Date() > new Date(poll.expiresAt)) {
    throw ApiError.badRequest("Poll expired");
  }

  // Save response
  poll.responses.push({
    user: user?.id || null,
    answers: data.answers,
  });

  await poll.save();

  // Realtime socket update
  io.emit("poll-response-updated", {
    pollId,
    totalResponses: poll.responses.length,
  });

  return poll;
};

// Analytics
const getAnalytics = async (pollId) => {
  const poll = await Poll.findById(pollId);

  if (!poll) {
    throw ApiError.notFound("Poll not found");
  }

  const analytics = poll.questions.map((question) => {
    const optionCounts = {};

    question.options.forEach((option) => {
      optionCounts[option] = 0;
    });

    poll.responses.forEach((response) => {
      response.answers.forEach((answer) => {
        if (answer.questionId.toString() === question._id.toString()) {
          optionCounts[answer.selectedOption] += 1;
        }
      });
    });

    return {
      question: question.question,
      optionCounts,
    };
  });

  return {
    totalResponses: poll.responses.length,
    analytics,
  };
};

// Publish results
const publishResults = async (pollId) => {
  const poll = await Poll.findByIdAndUpdate(
    pollId,
    {
      isPublished: true,
    },
    {
      new: true,
    },
  );

  return poll;
};

export { createPoll, getPoll, submitResponse, getAnalytics, publishResults };
