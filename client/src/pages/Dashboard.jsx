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
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <h2 className="text-xl font-bold text-blue-700 animate-pulse">
            Loading dashboard...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 py-10 px-2 flex flex-col items-center">
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-3 w-full">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-400 to-purple-400 flex items-center justify-center shadow-lg">
              <span className="text-2xl font-bold text-white">PB</span>
            </div>
            <h1 className="text-3xl font-extrabold text-blue-700 tracking-tight">
              My Poll Dashboard
            </h1>
          </div>
          <button
            onClick={() => navigate("/create")}
            className="bg-gradient-to-r from-blue-600 to-purple-500 hover:from-blue-700 hover:to-purple-600 text-white px-6 py-2 rounded-lg text-lg font-semibold transition-all shadow-lg cursor-pointer"
          >
            + Create Poll
          </button>
        </div>

        {/* EMPTY */}
        {polls.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-24">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-200 to-blue-200 flex items-center justify-center mb-4">
              <span className="text-4xl">📭</span>
            </div>
            <div className="text-center text-gray-500 text-lg font-medium">
              No polls created yet
            </div>
            <div className="text-center text-gray-400 text-sm mt-1">
              Start by creating your first poll!
            </div>
          </div>
        )}

        {/* POLLS */}
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full">
          {polls.map((poll) => (
            <div
              key={poll._id}
              className="p-6 border border-gray-100 rounded-3xl shadow-xl bg-white/95 backdrop-blur-md flex flex-col justify-between min-h-[150px] hover:scale-[1.03] hover:shadow-2xl transition-all duration-200 overflow-hidden relative"
            >
              {/* TITLE */}
              <h2 className="text-xl font-bold mb-2 truncate break-words text-blue-700">
                {poll.title}
              </h2>

              {/* INFO */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">
                  {poll.responses?.length || 0} Responses
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-semibold ${poll.isPublished ? "bg-green-100 text-green-700" : "bg-red-100 text-red-500"}`}
                >
                  {poll.isPublished ? "Published" : "Draft"}
                </span>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-2 mt-5 flex-wrap justify-center w-full">
                <button
                  onClick={() => navigate(`/poll/${poll._id}`)}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm sm:text-base transition-colors font-medium cursor-pointer"
                >
                  View
                </button>

                <button
                  onClick={() => sharePoll(poll._id)}
                  className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm sm:text-base transition-colors font-medium cursor-pointer"
                >
                  Share Link
                </button>

                <button
                  onClick={() => navigate(`/analytics/${poll._id}`)}
                  className="px-3 py-1 bg-blue-200 hover:bg-blue-300 rounded-lg text-sm sm:text-base transition-colors font-medium cursor-pointer"
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
                    className="px-3 py-1 bg-green-200 hover:bg-green-300 rounded-lg text-sm sm:text-base transition-colors font-medium cursor-pointer"
                  >
                    Results
                  </button>
                )}

                {!poll.isPublished && (
                  <button
                    onClick={() => publishPoll(poll._id)}
                    className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm sm:text-base transition-colors font-medium cursor-pointer"
                  >
                    Publish
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
