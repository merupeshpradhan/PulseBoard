// Analytics.jsx
// This page shows poll analytics with charts
// It helps poll creator understand responses

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import toast, { Toaster } from "react-hot-toast";

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
      <div className="flex items-center justify-center min-h-[60vh]">
        <h2 className="text-xl font-semibold animate-pulse text-blue-700">
          Loading analytics...
        </h2>
      </div>
    );
  }

  // -----------------------------
  // MAIN UI
  // -----------------------------
  return (
    <div className="w-full max-w-5xl mx-auto p-2 sm:p-4">
      <Toaster position="top-right" />
      {/* HEADER */}
      <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-blue-700">
        📊 Poll Analytics
      </h1>

      <p className="text-gray-600 mb-6 text-sm sm:text-base">
        Total Responses:{" "}
        <span className="font-semibold">{data?.totalResponses || 0}</span>
      </p>

      {/* QUESTIONS ANALYTICS */}
      <div className="space-y-8 sm:space-y-10">
        {data?.analytics?.map((q, index) => (
          <div key={index} className="bg-white p-3 sm:p-4 shadow rounded-lg">
            {/* Question */}
            <h2 className="font-semibold mb-4 text-base sm:text-lg">
              {q.question}
            </h2>

            {/* CHART */}
            <ResponsiveContainer
              width="100%"
              height={220}
              className="sm:h-[300px]"
            >
              <BarChart
                data={Object.keys(q.optionCounts).map((key) => ({
                  option: key,
                  votes: q.optionCounts[key],
                }))}
              >
                <XAxis dataKey="option" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="votes" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>

            {/* OPTION LIST */}
            <div className="mt-4 space-y-1">
              {Object.entries(q.optionCounts).map(([option, votes]) => (
                <div
                  key={option}
                  className="flex justify-between text-xs sm:text-sm"
                >
                  <span>{option}</span>
                  <span className="font-medium">{votes} votes</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Analytics;
