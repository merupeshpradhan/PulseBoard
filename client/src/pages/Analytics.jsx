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
      <div className="h-screen flex items-center justify-center">
        <h2 className="text-xl font-semibold">Loading analytics...</h2>
      </div>
    );
  }

  // -----------------------------
  // MAIN UI
  // -----------------------------
  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* HEADER */}
      <h1 className="text-2xl font-bold mb-2">📊 Poll Analytics</h1>

      <p className="text-gray-600 mb-6">
        Total Responses: {data?.totalResponses || 0}
      </p>

      {/* QUESTIONS ANALYTICS */}
      <div className="space-y-10">
        {data?.analytics?.map((q, index) => (
          <div key={index} className="bg-white p-4 shadow rounded-lg">
            {/* Question */}
            <h2 className="font-semibold mb-4">{q.question}</h2>

            {/* CHART */}
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={Object.keys(q.optionCounts).map((key) => ({
                  option: key,
                  votes: q.optionCounts[key],
                }))}
              >
                <XAxis dataKey="option" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="votes" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>

            {/* OPTION LIST */}
            <div className="mt-4 space-y-1">
              {Object.entries(q.optionCounts).map(([option, votes]) => (
                <div key={option} className="flex justify-between text-sm">
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
