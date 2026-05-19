// Dashboard.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import socket from "../socket/socket";
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
        setPolls(res.data.data || res.data);
      } catch (err) {
        toast.error("Failed to load polls");
      } finally {
        setLoading(false);
      }
    };

    fetchPolls();
  }, []);

  // SOCKET REALTIME LISTENER
  useEffect(() => {
    const handlePollUpdate = (data) => {
      setPolls((prevPolls) => {
        const holdsPoll = prevPolls.some((p) => p._id === data.pollId);
        if (!holdsPoll) return prevPolls;

        toast.success("New response received 🔥");

        return prevPolls.map((poll) => {
          if (poll._id === data.pollId) {
            const currentResponses = poll.responses || [];
            return {
              ...poll,
              responses: [...currentResponses, { _id: Date.now() }],
            };
          }
          return poll;
        });
      });
    };

    socket.on("poll-response-updated", handlePollUpdate);
    return () => {
      socket.off("poll-response-updated", handlePollUpdate);
    };
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

  // SHARE LINK FUNCTION
  const sharePoll = (id) => {
    const link = `${window.location.origin}/poll/${id}`;
    navigator.clipboard.writeText(link);
    toast.success("Poll link copied 📋");
  };

  // LOADING
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
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
    <div className="w-full py-6 px-1 flex flex-col items-center">
      <div className="w-full flex flex-col items-center">
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

        {/* EMPTY STATE */}
        {polls.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-20">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-200 to-blue-200 flex items-center justify-center mb-4">
              <span className="text-3xl">📭</span>
            </div>
            <div className="text-center text-gray-500 font-medium">
              No polls created yet
            </div>
            <div className="text-center text-gray-400 text-xs mt-1">
              Start by creating your first poll!
            </div>
          </div>
        )}

        {/* POLLS CARDS GRID */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full">
          {polls.map((poll) => (
            <div
              key={poll._id}
              className="p-5 border border-gray-100/80 rounded-3xl shadow-lg bg-white/95 backdrop-blur-sm flex flex-col justify-between min-h-[160px] hover:shadow-xl transition-all duration-200 overflow-hidden relative"
            >
              {/* TITLE */}
              <div>
                <h2
                  className="text-lg font-bold mb-2 truncate text-blue-700"
                  title={poll.title}
                >
                  {poll.title}
                </h2>

                {/* INFO STATUS CHIPS */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[11px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-bold border border-blue-100">
                    {poll.responses?.length || 0} Responses
                  </span>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-bold border ${
                      poll.isPublished
                        ? "bg-green-50 text-green-700 border-green-100"
                        : "bg-red-50 text-red-500 border-red-100"
                    }`}
                  >
                    {poll.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
              </div>

              {/* ACTION COMMAND BUTTONS CONTAINER */}
              <div className="flex gap-1.5 mt-2 flex-wrap justify-start w-full">
                <button
                  onClick={() => navigate(`/poll/${poll._id}`)}
                  className="flex-1 min-w-[60px] py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold transition-colors border border-gray-200/60 cursor-pointer text-center"
                >
                  View
                </button>

                <button
                  onClick={() => sharePoll(poll._id)}
                  className="flex-1 min-w-[85px] py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm cursor-pointer text-center"
                >
                  Share Link
                </button>

                <button
                  onClick={() => navigate(`/analytics/${poll._id}`)}
                  className="flex-1 min-w-[75px] py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold transition-colors border border-blue-100 cursor-pointer text-center"
                >
                  Analytics
                </button>

                {poll.isPublished ? (
                  <button
                    onClick={() => navigate(`/results/${poll._id}`)}
                    className="w-full mt-1 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold transition-colors border border-emerald-100 cursor-pointer text-center"
                  >
                    Results
                  </button>
                ) : (
                  <button
                    onClick={() => publishPoll(poll._id)}
                    className="w-full mt-1 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition-colors shadow-sm cursor-pointer text-center"
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
