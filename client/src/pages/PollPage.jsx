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
      // start loading
      setSubmitting(true);

      // answers array
      const answers = [];

      // loop questions
      for (const q of poll.questions) {
        // selected option
        const selectedOption = selectedAnswers[q._id];

        // validate option selected
        if (!selectedOption) {
          toast.error(`Please answer: ${q.question}`);

          setSubmitting(false);

          return;
        }

        // push valid answer
        answers.push({
          questionId: q._id,

          selectedOption,
        });
      }

      // debug log
      console.log("Sending Answers:", answers);

      // send vote to backend
      await api.post(`/polls/submit/${id}`, {
        answers,
      });

      // success message
      toast.success("Vote submitted successfully ✅");
    } catch (err) {
      console.log(err);

      // backend error
      toast.error(err.response?.data?.message || "Submit failed");
    } finally {
      // stop loading
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
    <div className="max-w-3xl mx-auto p-4">
      {/* POLL TITLE */}
      <h1 className="text-2xl font-bold mb-2">{poll?.title}</h1>

      {/* DESCRIPTION */}
      <p className="text-gray-600 mb-6">{poll?.description}</p>

      {/* ----------------------------- */}
      {/* EXPIRED MESSAGE */}
      {/* ----------------------------- */}
      {isExpired && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          This poll has expired. Voting is closed.
        </div>
      )}

      {/* QUESTIONS */}
      <div className="space-y-6">
        {poll?.questions?.map((q) => (
          <div key={q._id} className="p-4 border rounded-lg bg-white shadow-sm">
            {/* QUESTION */}
            <h3 className="font-semibold mb-3">
              {q.question}

              {q.required && <span className="text-red-500 ml-1">*</span>}
            </h3>

            {/* OPTIONS */}
            <div className="space-y-2">
              {q.options.map((opt, idx) => (
                <label
                  key={idx}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  {/* RADIO BUTTON */}
                  <input
                    type="radio"
                    name={q._id}
                    value={opt}
                    // disable if poll expired
                    disabled={isExpired}
                    // select option
                    onChange={() => handleSelect(q._id, opt)}
                  />

                  {/* OPTION TEXT */}
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ----------------------------- */}
      {/* SUBMIT BUTTON */}
      {/* HIDE IF EXPIRED */}
      {/* ----------------------------- */}
      {!isExpired && (
        <button
          onClick={submitVote}
          disabled={submitting}
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Vote"}
        </button>
      )}
    </div>
  );
};

export default PollPage;
