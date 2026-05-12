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
      <div className="h-screen flex items-center justify-center">
        <h2 className="text-xl font-semibold">Loading dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📊 My Poll Dashboard</h1>

        <button
          onClick={() => navigate("/create")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Create Poll
        </button>
      </div>

      {/* EMPTY */}
      {polls.length === 0 && (
        <div className="text-center text-gray-500 mt-20">
          No polls created yet
        </div>
      )}

      {/* POLLS */}
      <div className="grid gap-4">
        {polls.map((poll) => (
          <div key={poll._id} className="p-4 border rounded-lg shadow bg-white">
            {/* TITLE */}
            <h2 className="text-lg font-semibold">{poll.title}</h2>

            {/* INFO */}
            <p className="text-sm text-gray-500">
              Responses: {poll.responses?.length || 0}
            </p>

            <p className="text-sm">
              Status:{" "}
              {poll.isPublished ? (
                <span className="text-green-600">Published</span>
              ) : (
                <span className="text-red-500">Draft</span>
              )}
            </p>

            {/* ACTION BUTTONS */}
            <div className="flex gap-2 mt-3 flex-wrap">
              <button
                onClick={() => navigate(`/poll/${poll._id}`)}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                View
              </button>

              <button
                onClick={() => sharePoll(poll._id)}
                className="px-3 py-1 bg-green-500 text-white rounded"
              >
                Share Link
              </button>

              <button
                onClick={() => navigate(`/analytics/${poll._id}`)}
                className="px-3 py-1 bg-blue-200 rounded"
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
                  className="px-3 py-1 bg-green-200 rounded"
                >
                  Results
                </button>
              )}

              {!poll.isPublished && (
                <button
                  onClick={() => publishPoll(poll._id)}
                  className="px-3 py-1 bg-purple-600 text-white rounded"
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
