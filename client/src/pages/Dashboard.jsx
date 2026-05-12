// Dashboard.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";

const Dashboard = () => {
  const navigate = useNavigate();

  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH POLLS
  useEffect(() => {
    const fetchPolls = async () => {
      try {
        setLoading(true);

        const res = await api.get("/polls/my-polls");
        setPolls(res.data.data);
      } catch (err) {
        toast.error("Failed to load polls");
      } finally {
        setLoading(false);
      }
    };

    fetchPolls();
  }, []);

  // PUBLISH POLL
  const publishPoll = async (id) => {
    try {
      await api.patch(`/polls/publish/${id}`);

      toast.success("Poll published 🎉");

      setPolls((prev) =>
        prev.map((p) => (p._id === id ? { ...p, isPublished: true } : p)),
      );
    } catch (err) {
      toast.error("Failed to publish");
    }
  };

  // SHARE LINK FUNCTION ⭐ IMPORTANT
  const sharePoll = (id) => {
    const link = `${window.location.origin}/poll/${id}`;
    navigator.clipboard.writeText(link);
    toast.success("Poll link copied 📋");
  };

  // LOADING
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <h2 className="text-xl font-semibold animate-pulse text-blue-700">
          Loading dashboard...
        </h2>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-3 w-full">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-700">
          📊 My Poll Dashboard
        </h1>

        <button
          onClick={() => navigate("/create")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-base font-semibold transition-colors shadow"
        >
          + Create Poll
        </button>
      </div>

      {/* EMPTY */}
      {polls.length === 0 && (
        <div className="text-center text-gray-500 mt-20 text-base sm:text-lg">
          No polls created yet
        </div>
      )}

      {/* POLLS */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full">
        {polls.map((poll) => (
          <div
            key={poll._id}
            className="p-5 border border-gray-200 rounded-2xl shadow-lg bg-white/90 backdrop-blur-md flex flex-col justify-between min-h-[220px] hover:scale-[1.025] hover:shadow-2xl transition-all duration-200 overflow-hidden"
          >
            {/* TITLE */}
            <h2 className="text-lg font-semibold mb-1 truncate break-words">
              {poll.title}
            </h2>

            {/* INFO */}
            <p className="text-sm text-gray-500 mb-1">
              Responses: {poll.responses?.length || 0}
            </p>

            <p className="text-sm mb-2">
              Status:{" "}
              {poll.isPublished ? (
                <span className="text-green-600 font-semibold">Published</span>
              ) : (
                <span className="text-red-500 font-semibold">Draft</span>
              )}
            </p>

            {/* ACTION BUTTONS */}
            <div className="flex gap-2 mt-3 flex-wrap w-full">
              <button
                onClick={() => navigate(`/poll/${poll._id}`)}
                className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm sm:text-base transition-colors"
              >
                View
              </button>

              <button
                onClick={() => sharePoll(poll._id)}
                className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm sm:text-base transition-colors"
              >
                Share Link
              </button>

              <button
                onClick={() => navigate(`/analytics/${poll._id}`)}
                className="px-3 py-1 bg-blue-200 hover:bg-blue-300 rounded text-sm sm:text-base transition-colors"
              >
                Analytics
              </button>

              {/*
                RESULTS BUTTON
                Only visible after poll is published
                This prevents users from opening
                public results before publish
              */}

              {poll.isPublished && (
                <button
                  onClick={() => navigate(`/results/${poll._id}`)}
                  className="px-3 py-1 bg-green-200 hover:bg-green-300 rounded text-sm sm:text-base transition-colors"
                >
                  Results
                </button>
              )}

              {!poll.isPublished && (
                <button
                  onClick={() => publishPoll(poll._id)}
                  className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm sm:text-base transition-colors"
                >
                  Publish
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
