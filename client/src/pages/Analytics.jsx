// Analytics.jsx
// This page shows poll analytics with charts
// It helps poll creator understand responses

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Analytics = () => {
  const { id } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // -----------------------------
  // FETCH ANALYTICS
  // -----------------------------
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);

        const res = await api.get(`/polls/analytics/${id}`);
        setData(res.data.data);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [id]);

  // -----------------------------
  // LOADING UI
  // -----------------------------
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <h2 className="text-xl font-bold text-blue-700 animate-pulse">
            Loading analytics...
          </h2>
        </div>
      </div>
    );
  }

  // -----------------------------
  // MAIN UI
  // -----------------------------
  return (
    <div className="min-h-full w-full bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 py-3 px-2 flex flex-col items-center">
      <div className="w-full max-w-5xl mx-auto p-2 sm:p-4">
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-400 to-purple-400 flex items-center justify-center shadow-lg">
            <span className="text-2xl font-bold text-white">PB</span>
          </div>
          <h1 className="text-3xl font-extrabold text-blue-700 tracking-tight">
            Poll Analytics
          </h1>
        </div>

        <p className="text-gray-600 mb-8 text-base font-medium">
          Total Responses:{" "}
          <span className="font-bold text-blue-700">
            {data?.totalResponses || 0}
          </span>
        </p>

        {/* QUESTIONS ANALYTICS */}
        <div className="space-y-10">
          {data?.analytics?.map((q, index) => (
            <div
              key={index}
              className="bg-white/95 p-5 sm:p-7 shadow-xl rounded-3xl"
            >
              {/* Question */}
              <h2 className="font-semibold mb-4 text-lg sm:text-xl text-purple-700">
                {q.question}
              </h2>

              {/* CHART */}
              <ResponsiveContainer
                width="100%"
                height={240}
                className="sm:h-[300px]"
              >
                <BarChart
                  data={Object.keys(q.optionCounts).map((key) => ({
                    option: key,
                    votes: q.optionCounts[key],
                  }))}
                >
                  <XAxis dataKey="option" fontSize={13} />
                  <YAxis fontSize={13} />
                  <Tooltip />
                  <Bar dataKey="votes" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>

              {/* OPTION LIST */}
              <div className="mt-5 space-y-1">
                {Object.entries(q.optionCounts).map(([option, votes]) => (
                  <div
                    key={option}
                    className="flex justify-between text-sm sm:text-base"
                  >
                    <span>{option}</span>
                    <span className="font-semibold text-blue-700">
                      {votes} votes
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
