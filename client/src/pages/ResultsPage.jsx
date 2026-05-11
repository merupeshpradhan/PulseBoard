// ResultsPage.jsx
// This page shows FINAL published poll results to everyone
// Works even for non-logged-in users

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

const ResultsPage = () => {
  const { id } = useParams();

  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);

  // -----------------------------
  // FETCH FINAL RESULTS
  // -----------------------------
  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);

        // PUBLIC endpoint (no auth required)
        const res = await api.get(`/polls/results/${id}`);

        setPoll(res.data.data);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load results");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [id]);

  // -----------------------------
  // LOADING UI
  // -----------------------------
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <h2 className="text-xl font-semibold">Loading results...</h2>
      </div>
    );
  }

  // -----------------------------
  // IF NOT PUBLISHED
  // -----------------------------
  if (!poll?.isPublished) {
    return (
      <div className="h-screen flex items-center justify-center">
        <h2 className="text-xl font-semibold text-red-500">
          Results not published yet
        </h2>
      </div>
    );
  }

  // -----------------------------
  // MAIN UI
  // -----------------------------
  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* TITLE */}
      <h1 className="text-2xl font-bold mb-2">📢 Final Poll Results</h1>

      <p className="text-gray-600 mb-6">{poll.title}</p>

      {/* QUESTIONS */}
      <div className="space-y-10">
        {poll.questions.map((q, index) => {
          // count votes for each option
          const optionCounts = {};

          q.options.forEach((opt) => {
            optionCounts[opt] = 0;
          });

          poll.responses.forEach((res) => {
            res.answers.forEach((ans) => {
              if (ans.questionId === q._id) {
                optionCounts[ans.selectedOption] += 1;
              }
            });
          });

          return (
            <div key={index} className="bg-white p-4 shadow rounded-lg">
              {/* QUESTION */}
              <h2 className="font-semibold mb-4">{q.question}</h2>

              {/* CHART */}
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={Object.keys(optionCounts).map((key) => ({
                    option: key,
                    votes: optionCounts[key],
                  }))}
                >
                  <XAxis dataKey="option" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="votes" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>

              {/* LIST */}
              <div className="mt-4 space-y-1">
                {Object.entries(optionCounts).map(([opt, count]) => (
                  <div key={opt} className="flex justify-between">
                    <span>{opt}</span>
                    <span className="font-medium">{count} votes</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResultsPage;
