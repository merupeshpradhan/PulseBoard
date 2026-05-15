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
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <h2 className="text-xl font-bold text-green-700 animate-pulse">
            Loading results...
          </h2>
        </div>
      </div>
    );
  }

  // -----------------------------
  // IF NOT PUBLISHED
  // -----------------------------
  if (!poll?.isPublished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
        <h2 className="text-xl font-bold text-red-500">
          Results not published yet
        </h2>
      </div>
    );
  }

  // -----------------------------
  // MAIN UI
  // -----------------------------
  return (
    <div className="min-h-full w-full bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 py-3 px-2 flex flex-col items-center">
      <div className="w-full max-w-5xl mx-auto p-2 sm:p-4">
        {/* TITLE */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-green-400 to-blue-400 flex items-center justify-center shadow-lg">
            <span className="text-2xl font-bold text-white">PB</span>
          </div>
          <h1 className="text-3xl font-extrabold text-green-700 tracking-tight">
            Final Poll Results
          </h1>
        </div>

        <p className="text-gray-600 mb-8 text-base font-medium">{poll.title}</p>

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
              <div
                key={index}
                className="bg-white/95 p-5 sm:p-7 shadow-xl rounded-3xl"
              >
                {/* QUESTION */}
                <h2 className="font-semibold mb-4 text-lg sm:text-xl text-blue-700">
                  {q.question}
                </h2>

                {/* CHART */}
                <ResponsiveContainer
                  width="100%"
                  height={240}
                  className="sm:h-[300px]"
                >
                  <BarChart
                    data={Object.keys(optionCounts).map((key) => ({
                      option: key,
                      votes: optionCounts[key],
                    }))}
                  >
                    <XAxis dataKey="option" fontSize={13} />
                    <YAxis fontSize={13} />
                    <Tooltip />
                    <Bar dataKey="votes" fill="#10b981" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>

                {/* LIST */}
                <div className="mt-5 space-y-1">
                  {Object.entries(optionCounts).map(([opt, count]) => (
                    <div
                      key={opt}
                      className="flex justify-between text-sm sm:text-base"
                    >
                      <span>{opt}</span>
                      <span className="font-semibold text-green-700">
                        {count} votes
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
