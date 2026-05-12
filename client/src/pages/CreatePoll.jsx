// CreatePoll.jsx
// This page allows users to:
// 1. Create poll title
// 2. Add description
// 3. Add expiry date
// 4. Add options dynamically
// 5. Create poll

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
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

      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create poll");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-2 sm:p-4">
      <Toaster position="top-right" />
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-blue-700">
        Create Poll
      </h1>

      {/* TITLE */}
      <input
        type="text"
        placeholder="Poll Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border border-gray-300 p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
      />

      {/* DESCRIPTION */}
      <textarea
        placeholder="Poll Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border border-gray-300 p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
        rows={3}
      />

      {/* QUESTION */}
      <input
        type="text"
        placeholder="Question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="w-full border border-gray-300 p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
      />
      {/* OPTIONS */}
      <div className="space-y-3 mb-4">
        {options.map((option, index) => (
          <input
            key={index}
            type="text"
            placeholder={`Option ${index + 1}`}
            value={option}
            onChange={(e) => handleOptionChange(index, e.target.value)}
            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
          />
        ))}
      </div>
      {/* ADD OPTION BUTTON */}
      <button
        onClick={addOption}
        className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded mb-4 text-sm sm:text-base transition-colors"
      >
        + Add Option
      </button>

      {/* EXPIRY DATE */}
      <input
        type="datetime-local"
        value={expiresAt}
        onChange={(e) => setExpiresAt(e.target.value)}
        className="w-full border border-gray-300 p-3 rounded mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
      />

      {/* CREATE BUTTON */}
      <button
        onClick={createPoll}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded text-base font-semibold transition-colors shadow"
      >
        Create Poll
      </button>
    </div>
  );
};

export default CreatePoll;
