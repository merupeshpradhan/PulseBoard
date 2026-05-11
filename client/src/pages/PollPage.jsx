// PollPage.jsx
// This page is used for:
// 1. Showing a public poll
// 2. Allowing user to vote
// 3. Handling authentication optional voting
// 4. Receiving realtime updates via socket.io

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import socket from "../socket/socket";
import toast from "react-hot-toast";

const PollPage = () => {
  const { id } = useParams();

  // store poll data
  const [poll, setPoll] = useState(null);

  // selected answers (single choice per question)
  const [selectedAnswers, setSelectedAnswers] = useState({});

  // loading state
  const [loading, setLoading] = useState(true);

  // submit state
  const [submitting, setSubmitting] = useState(false);

  // -----------------------------
  // LOAD POLL
  // -----------------------------
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

  // -----------------------------
  // SOCKET REALTIME LISTENER
  // -----------------------------
  useEffect(() => {
    socket.on("poll-response-updated", (data) => {
      // update UI in real-time (optional enhancement)
      if (data.pollId === id) {
        toast.success("New response received 🔥");
      }
    });

    return () => socket.off("poll-response-updated");
  }, [id]);

  // -----------------------------
  // SELECT OPTION
  // -----------------------------
  const handleSelect = (questionId, option) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  // -----------------------------
  // SUBMIT VOTE
  // -----------------------------
  const submitVote = async () => {
    if (!poll) return;

    try {
      setSubmitting(true);

      const answers = poll.questions.map((q) => ({
        questionId: q._id,
        selectedOption: selectedAnswers[q._id],
      }));

      await api.post(`/polls/submit/${id}`, { answers });

      toast.success("Vote submitted successfully ✅");
    } catch (err) {
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
      <div className="flex justify-center items-center h-screen">
        <h2 className="text-xl font-semibold">Loading poll...</h2>
      </div>
    );
  }

  // -----------------------------
  // MAIN UI
  // -----------------------------
  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* Poll Title */}
      <h1 className="text-2xl font-bold mb-2">{poll?.title}</h1>

      {/* Description */}
      <p className="text-gray-600 mb-6">{poll?.description}</p>

      {/* Questions */}
      <div className="space-y-6">
        {poll?.questions?.map((q) => (
          <div key={q._id} className="p-4 border rounded-lg bg-white shadow-sm">
            {/* Question text */}
            <h3 className="font-semibold mb-3">
              {q.question}
              {q.required && <span className="text-red-500 ml-1">*</span>}
            </h3>

            {/* Options */}
            <div className="space-y-2">
              {q.options.map((opt, idx) => (
                <label
                  key={idx}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name={q._id}
                    value={opt}
                    onChange={() => handleSelect(q._id, opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <button
        onClick={submitVote}
        disabled={submitting}
        className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {submitting ? "Submitting..." : "Submit Vote"}
      </button>
    </div>
  );
};

export default PollPage;
