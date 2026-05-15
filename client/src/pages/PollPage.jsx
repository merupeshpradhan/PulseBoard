// PollPage.jsx
// This page:
// 1. Shows public poll
// 2. Allows users to vote
// 3. Supports anonymous voting
// 4. Shows realtime updates
// 5. Prevents voting after poll expiry

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import socket from "../socket/socket";
import toast from "react-hot-toast";

const PollPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [poll, setPoll] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // 💡 FIXED INITIAL STATE: Permanently checks localStorage for this specific poll ID on refresh!
  const [hasVoted, setHasVoted] = useState(() => {
    return localStorage.getItem(`voted_poll_${id}`) === "true";
  });
  const [justVoted, setJustVoted] = useState(false);

  // FETCH POLL DATA
  useEffect(() => {
    const fetchPoll = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/polls/${id}`);
        setPoll(res.data.data);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load poll");
      } finally {
        setLoading(false);
      }
    };
    fetchPoll();
  }, [id]);

  // SOCKET REALTIME LISTENER
  useEffect(() => {
    socket.on("poll-response-updated", (data) => {
      if (data.pollId === id) {
        // i safely reset our internal submit flag without showing intrusive pop-ups to the voter
        setJustVoted(false);
      }
    });
    return () => {
      socket.off("poll-response-updated");
    };
  }, [id]);

  const handleSelect = (questionId, option) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  // SUBMIT VOTE FUNCTION
  const submitVote = async () => {
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

      setJustVoted(true);
      await api.post(`/polls/submit/${id}`, { answers });

      toast.success("Vote submitted successfully ✅");
      setSelectedAnswers({});

      // 💡 SAVE TO STORAGE: Locks the ballot flag inside the browser memory map permanently
      localStorage.setItem(`voted_poll_${id}`, "true");
      setHasVoted(true);
    } catch (err) {
      console.log(err);
      setJustVoted(false);
      toast.error(err.response?.data?.message || "Submit failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <h2 className="text-xl font-bold text-blue-700 animate-pulse">
            {" "}
            Loading poll...{" "}
          </h2>
        </div>
      </div>
    );
  }

  const isExpired = new Date(poll?.expiresAt).getTime() < Date.now();

  return (
    <div className="min-h-full w-full bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 pt-8 px-2 flex flex-col items-center">
      <div className="w-full max-w-3xl mx-auto bg-white/95 rounded-3xl shadow-2xl p-8 flex flex-col gap-6 transition-all duration-300">
        {hasVoted ? (
          /* SUCCESS STATE INTERFACE */
          <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-green-400 to-teal-400 flex items-center justify-center shadow-xl mb-6 transform scale-110 animate-bounce">
              <span className="text-5xl text-white">🎉</span>
            </div>
            <h1 className="text-4xl font-extrabold text-green-600 mb-3 tracking-tight">
              Thank You!
            </h1>
            <p className="text-xl font-semibold text-gray-700 mb-2">
              Your vote has been securely cast.
            </p>
            <p className="text-gray-500 max-w-md mb-8 text-base">
              Your response was added to "{poll?.title}" in real-time. Results
              will be calculated once the poll window concludes.
            </p>
            <div className="flex gap-4 w-full justify-center flex-wrap">
              <button
                onClick={() => navigate("/dashboard")}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-md transition-all cursor-pointer text-base"
              >
                Go to Homepage
              </button>
              {poll?.isPublished && (
                <button
                  onClick={() => navigate(`/results/${id}`)}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl shadow-md transition-all cursor-pointer text-base border border-gray-200"
                >
                  View Live Results
                </button>
              )}
            </div>
          </div>
        ) : (
          /* STANDARD FORM QUESTIONNAIRE INTERFACE */
          <>
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
                  <h3 className="font-semibold mb-3 text-lg text-purple-700">
                    {q.question}{" "}
                    {q.required && <span className="text-red-500 ml-1">*</span>}
                  </h3>
                  <div className="space-y-2">
                    {q.options.map((opt, idx) => (
                      <label
                        key={idx}
                        className="flex items-center gap-2 cursor-pointer text-base"
                      >
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
                className="mt-4 w-full bg-gradient-to-r from-blue-600 to-purple-500 hover:from-blue-700 hover:to-purple-600 text-white py-3 rounded-lg text-lg font-semibold transition-all shadow-lg disabled:opacity-50 cursor-pointer"
              >
                {submitting ? "Submitting..." : "Submit Vote"}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PollPage;
