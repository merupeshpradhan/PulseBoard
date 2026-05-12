// PollPage.jsx
// This page:
// 1. Shows public poll
// 2. Allows users to vote
// 3. Supports anonymous voting
// 4. Shows realtime updates
// 5. Prevents voting after poll expiry

import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import api from "../services/api";

import socket from "../socket/socket";

import toast, { Toaster } from "react-hot-toast";

const PollPage = () => {
  // get poll id from URL
  const { id } = useParams();

  // store poll data
  const [poll, setPoll] = useState(null);

  // selected answers
  const [selectedAnswers, setSelectedAnswers] = useState({});

  // loading state
  const [loading, setLoading] = useState(true);

  // submit loading state
  const [submitting, setSubmitting] = useState(false);

  // -----------------------------
  // FETCH POLL DATA
  // -----------------------------
  useEffect(() => {
    const fetchPoll = async () => {
      try {
        // start loading
        setLoading(true);

        // backend request
        const res = await api.get(`/polls/${id}`);

        // save poll data
        setPoll(res.data.data);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load poll");
      } finally {
        // stop loading
        setLoading(false);
      }
    };

    fetchPoll();
  }, [id]);

  // -----------------------------
  // SOCKET REALTIME LISTENER
  // -----------------------------
  useEffect(() => {
    socket.on("poll-response-updated", (data) => {
      // check current poll
      if (data.pollId === id) {
        toast.success("New response received 🔥");
      }
    });

    // cleanup listener
    return () => {
      socket.off("poll-response-updated");
    };
  }, [id]);

  // -----------------------------
  // HANDLE OPTION SELECT
  // -----------------------------
  const handleSelect = (questionId, option) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  // -----------------------------
  // SUBMIT VOTE FUNCTION
  // -----------------------------
  const submitVote = async () => {
    // stop if no poll
    if (!poll) return;

    try {
      setSubmitting(true);
      const answers = [];
      for (const q of poll.questions) {
        const selectedOption = selectedAnswers[q._id];
        if (!selectedOption) {
          toast.error(`Please answer: ${q.question}`);
          setSubmitting(false);
          return;
        }
        answers.push({
          questionId: q._id,
          selectedOption,
        });
      }
      await api.post(`/polls/submit/${id}`, { answers });
      toast.success("Vote submitted successfully ✅");
      // Remove selected poll after submit
      setSelectedAnswers({});
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Submit failed");
    } finally {
      setSubmitting(false);
    }
  };

  // -----------------------------
  // LOADING UI
  // -----------------------------
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <h2 className="text-xl font-semibold animate-pulse text-blue-700">
          Loading poll...
        </h2>
      </div>
    );
  }

  // -----------------------------
  // CHECK POLL EXPIRY
  // compares timestamps properly
  // -----------------------------
  const isExpired = new Date(poll?.expiresAt).getTime() < Date.now();

  // -----------------------------
  // DEBUG LOG
  // -----------------------------
  console.log({
    expiresAt: poll?.expiresAt,

    currentTime: new Date(),

    isExpired,
  });

  // -----------------------------
  // MAIN UI
  // -----------------------------
  return (
    <div className="w-full max-w-3xl mx-auto p-2 sm:p-4">
      <Toaster position="top-right" />
      {/* POLL TITLE */}
      <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-blue-700">
        {poll?.title}
      </h1>

      {/* DESCRIPTION */}
      <p className="text-gray-600 mb-6 text-sm sm:text-base">
        {poll?.description}
      </p>

      {/* EXPIRED MESSAGE */}
      {isExpired && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm sm:text-base">
          This poll has expired. Voting is closed.
        </div>
      )}

      {/* QUESTIONS */}
      <div className="space-y-6">
        {poll?.questions?.map((q) => (
          <div key={q._id} className="p-4 border rounded-lg bg-white shadow-sm">
            {/* QUESTION */}
            <h3 className="font-semibold mb-3 text-base sm:text-lg">
              {q.question}
              {q.required && <span className="text-red-500 ml-1">*</span>}
            </h3>

            {/* OPTIONS */}
            <div className="space-y-2">
              {q.options.map((opt, idx) => (
                <label
                  key={idx}
                  className="flex items-center gap-2 cursor-pointer text-sm sm:text-base"
                >
                  {/* RADIO BUTTON */}
                  <input
                    type="radio"
                    name={q._id}
                    value={opt}
                    disabled={isExpired}
                    checked={selectedAnswers[q._id] === opt}
                    onChange={() => handleSelect(q._id, opt)}
                    className="accent-blue-600"
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* SUBMIT BUTTON */}
      {!isExpired && (
        <button
          onClick={submitVote}
          disabled={submitting}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-base font-semibold transition-colors shadow disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Vote"}
        </button>
      )}
    </div>
  );
};

export default PollPage;
