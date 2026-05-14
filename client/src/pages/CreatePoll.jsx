// CreatePoll.jsx
// This page allows users to:
// 1. Create poll title
// 2. Add description
// 3. Add expiry date
// 4. Add options dynamically
// 5. Create poll

import { useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const CreatePoll = () => {
  const navigate = useNavigate();

  // poll title
  const [title, setTitle] = useState("");

  // poll description
  const [description, setDescription] = useState("");

  // question
  const [question, setQuestion] = useState("");

  // expiry date
  const [expiresAt, setExpiresAt] = useState("");

  // options array
  const [options, setOptions] = useState(["", ""]);

  // -----------------------------
  // HANDLE OPTION CHANGE
  // -----------------------------
  const handleOptionChange = (index, value) => {
    const updated = [...options];

    updated[index] = value;

    setOptions(updated);
  };

  // -----------------------------
  // ADD NEW OPTION
  // -----------------------------
  const addOption = () => {
    setOptions([...options, ""]);
  };

  // -----------------------------
  // CREATE POLL
  // -----------------------------
  const createPoll = async () => {
    try {
      // remove empty options
      const cleanedOptions = options.filter((opt) => opt.trim() !== "");

      // minimum 2 options required
      if (cleanedOptions.length < 2) {
        toast.error("At least 2 options required");

        return;
      }

      // send request to backend
      await api.post("/polls/create", {
        title,
        description,
        allowAnonymous: true,
        expiresAt,
        questions: [
          {
            question,
            required: true,
            options: cleanedOptions,
          },
        ],
      });

      toast.success("Poll created successfully");

      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create poll");
    }
  };

  return (
    <div className="min-h-full w-full bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 py-10 px-2 flex flex-col items-center">
      <div className="w-full max-w-2xl mx-auto bg-white/95 rounded-3xl shadow-2xl p-8 flex flex-col gap-5">
        <div className="flex flex-col items-center mb-2">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-400 to-purple-400 flex items-center justify-center shadow-lg mb-2">
            <span className="text-3xl font-bold text-white">PB</span>
          </div>
          <h1 className="text-3xl font-extrabold text-blue-700 tracking-tight mb-1">
            Create Poll
          </h1>
          <p className="text-gray-500 text-sm">
            Design your poll and engage your audience!
          </p>
        </div>

        {/* TITLE */}
        <input
          type="text"
          placeholder="Poll Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-blue-200 p-3 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base transition-all"
        />

        {/* DESCRIPTION */}
        <textarea
          placeholder="Poll Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-blue-200 p-3 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base transition-all"
          rows={3}
        />

        {/* QUESTION */}
        <input
          type="text"
          placeholder="Question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full border border-blue-200 p-3 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base transition-all"
        />

        {/* OPTIONS */}
        <div className="space-y-2 mb-2">
          {options.map((option, index) => (
            <input
              key={index}
              type="text"
              placeholder={`Option ${index + 1}`}
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              className="w-full border border-blue-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-base transition-all"
            />
          ))}
        </div>
        {/* ADD OPTION BUTTON */}
        <button
          onClick={addOption}
          className="bg-gradient-to-r from-gray-200 to-blue-100 hover:from-blue-200 hover:to-purple-100 px-4 py-2 rounded-lg mb-2 text-base transition-colors w-full font-semibold"
        >
          + Add Option
        </button>

        {/* EXPIRY DATE */}
        <input
          type="datetime-local"
          value={expiresAt}
          onChange={(e) => setExpiresAt(e.target.value)}
          className="w-full border border-blue-200 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base transition-all"
        />

        {/* CREATE BUTTON */}
        <button
          onClick={createPoll}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-500 hover:from-blue-700 hover:to-purple-600 text-white py-3 rounded-lg text-lg font-semibold transition-all shadow-lg"
        >
          Create Poll
        </button>
      </div>
    </div>
  );
};

export default CreatePoll;
