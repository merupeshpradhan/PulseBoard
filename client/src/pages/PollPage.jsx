// PollPage.jsx
// This page:
// 1. Shows public poll
// 2. Allows users to vote
// 3. Supports anonymous voting
// 4. Shows realtime updates via WebSockets
// 5. Prevents voting after poll expiry
// 6. Renders a beautiful landing page if the poll is an unpublished draft

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import socket from "../socket/socket";
import toast from "react-hot-toast";

const PollPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [poll, setPoll] = useState(null);

  // 💡 FIXED ANSWER STATE: Tracks options by array indexes instead of matching text strings
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Checks localStorage for this specific poll ID on refresh to lock the ballot
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
        setPoll(res.data.data || res.data);
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
    const handleRemoteResponse = (data) => {
      if (data.pollId === id) {
        setJustVoted(false);
      }
    };

    socket.on("poll-response-updated", handleRemoteResponse);

    // Safely removes only this single listener instance on component unmount
    return () => {
      socket.off("poll-response-updated", handleRemoteResponse);
    };
  }, [id]);

  // FIXED SELECTION: Receives and saves index number position uniquely
  const handleSelect = (questionId, index) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: index,
    }));
  };

  // SUBMIT VOTE FUNCTION
  const submitVote = async () => {
    if (!poll) return;
    try {
      setSubmitting(true);
      const answers = [];

      for (const q of poll.questions) {
        const selectedIdx = selectedAnswers[q._id];

        // Verifies if an entry index exists safely
        if (selectedIdx === undefined) {
          toast.error(`Please answer: ${q.question}`);
          setSubmitting(false);
          return;
        }

        // CONVERTS BACK TO TEXT: Pulls string text back out safely using array position index
        answers.push({
          questionId: q._id,
          selectedOption: q.options[selectedIdx],
        });
      }

      setJustVoted(true);
      await api.post(`/polls/submit/${id}`, { answers });

      toast.success("Vote submitted successfully ✅");
      setSelectedAnswers({});

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

  // 1. STANDARD LOADING VIEW
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

  // 💡 2. PREMIUM NEW BLOCK: Beautiful "Poll Not Published / Draft" State View
  if (!poll) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 pt-16 px-4 flex flex-col items-center">
        <div className="w-full max-w-lg bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-10 flex flex-col items-center text-center relative border border-white/20 overflow-hidden">
          {/* Top Decorative Gradient Ring */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400" />

          {/* Animated Status Icon Frame */}
          <div className="w-24 h-24 rounded-full bg-orange-50 border-4 border-orange-100 flex items-center justify-center mb-6 shadow-inner relative animate-pulse">
            <span className="text-5xl">⏳</span>
            <div className="absolute -bottom-1 -right-1 bg-orange-500 text-white text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-md border border-white">
              Draft
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-extrabold text-gray-800 mb-3 tracking-tight">
            Poll Not Active Yet
          </h1>

          {/* Subtext Description */}
          <p className="text-gray-500 max-w-sm mb-8 text-base leading-relaxed">
            The creator shared this link, but the poll has not been published to
            the public yet. Please check back later!
          </p>

          {/* Info Status Grid */}
          <div className="w-full bg-gray-50/80 rounded-2xl p-4 mb-8 border border-gray-100 text-left flex flex-col gap-2">
            <div className="flex justify-between items-center text-sm border-b border-gray-200/60 pb-2">
              <span className="text-gray-400 font-medium">Platform</span>
              <span className="text-blue-600 font-bold tracking-tight">
                PulseBoard
              </span>
            </div>
            <div className="flex justify-between items-center text-sm pt-1">
              <span className="text-gray-400 font-medium">Availability</span>
              <span className="text-orange-600 font-semibold bg-orange-50 px-2 py-0.5 rounded-full text-xs border border-orange-100">
                Awaiting Publication
              </span>
            </div>
          </div>

          {/* Action Navigation Controls */}
          <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
            <button
              onClick={() => navigate("/")}
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer text-base active:scale-95"
            >
              Go to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. EXPIRY ASSESSMENT BLOCK
  const isExpired = poll?.expiresAt
    ? new Date(poll.expiresAt).getTime() < Date.now()
    : false;

  return (
    <div className="min-h-full w-full bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 pt-8 px-2 flex flex-col items-center">
      <div className="w-full max-w-3xl mx-auto bg-white/95 rounded-3xl shadow-2xl p-8 flex flex-col gap-6 transition-all duration-300">
        {hasVoted ? (
          /* SUCCESS STATE INTERFACE */
          <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-green-400 to-teal-400 flex items-center justify-center shadow-xl mb-6 transform scale-110">
              <span className="text-5xl text-white">🎉</span>
            </div>
            <h1 className="text-4xl font-extrabold text-green-600 mb-3 tracking-tight">
              Thank You!
            </h1>
            <p className="text-xl font-semibold text-gray-700 mb-2">
              Your vote has been securely cast.
            </p>
            <p className="text-gray-500 max-w-md mb-8 text-base">
              Your response was added to "{poll?.title}" in real-time.
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

            {/* QUESTIONS MAP */}
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
                        className="flex items-center gap-2 cursor-pointer text-base w-full py-1"
                      >
                        <input
                          type="radio"
                          name={q._id}
                          disabled={isExpired}
                          // 💡 FIXED CHECK: Matches state by index number, supporting duplicate text labels flawlessly!
                          checked={selectedAnswers[q._id] === idx}
                          onChange={() => handleSelect(q._id, idx)}
                          className="accent-blue-600"
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* SUBMIT BALLOT BUTTON */}
            {!isExpired && (
              <button
                onClick={submitVote}
                disabled={submitting}
                className="mt-4 w-full bg-gradient-to-r from-blue-600 to-purple-500 hover:from-blue-700 hover:to-purple-600 text-white py-3 rounded-lg text-lg font-semibold transition-all shadow-lg cursor-pointer"
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
