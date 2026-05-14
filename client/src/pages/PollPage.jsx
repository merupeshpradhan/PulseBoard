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
import toast from "react-hot-toast";

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
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <h2 className="text-xl font-bold text-blue-700 animate-pulse">
            Loading poll...
          </h2>
        </div>
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
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 py-10 px-2 flex flex-col items-center">
      <div className="w-full max-w-3xl mx-auto bg-white/95 rounded-3xl shadow-2xl p-8 flex flex-col gap-6">
        {/* POLL TITLE */}
        <div className="flex flex-col items-center mb-2">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-400 to-purple-400 flex items-center justify-center shadow-lg mb-2">
            <span className="text-2xl font-bold text-white">PB</span>
          </div>
          <h1 className="text-3xl font-extrabold text-blue-700 tracking-tight mb-1 text-center">
            {poll?.title}
          </h1>
        </div>

        {/* DESCRIPTION */}
        <p className="text-gray-600 mb-2 text-base text-center">
          {poll?.description}
        </p>

        {/* EXPIRED MESSAGE */}
        {isExpired && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-base text-center">
            This poll has expired. Voting is closed.
          </div>
        )}

        {/* QUESTIONS */}
        <div className="space-y-6">
          {poll?.questions?.map((q) => (
            <div
              key={q._id}
              className="p-5 border border-blue-100 rounded-2xl bg-white/95 shadow flex flex-col"
            >
              {/* QUESTION */}
              <h3 className="font-semibold mb-3 text-lg text-purple-700">
                {q.question}
                {q.required && <span className="text-red-500 ml-1">*</span>}
              </h3>

              {/* OPTIONS */}
              <div className="space-y-2">
                {q.options.map((opt, idx) => (
                  <label
                    key={idx}
                    className="flex items-center gap-2 cursor-pointer text-base"
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
            className="mt-4 w-full bg-gradient-to-r from-blue-600 to-purple-500 hover:from-blue-700 hover:to-purple-600 text-white py-3 rounded-lg text-lg font-semibold transition-all shadow-lg disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Vote"}
          </button>
        )}
      </div>
    </div>
  );
};

export default PollPage;
