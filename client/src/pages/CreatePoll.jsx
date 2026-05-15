// CreatePoll.jsx
// This page allows users to:
// 1. Create poll title
// 2. Add description
// 3. Add question
// 4. Add options dynamically
// 5. Set expiry date
// 6. Create poll successfully

import { useState } from "react";

import toast from "react-hot-toast";

import api from "../services/api";

import { useNavigate } from "react-router-dom";

const CreatePoll = () => {
  // page navigation
  const navigate = useNavigate();

  // -----------------------------
  // FORM STATES
  // -----------------------------

  // poll title
  const [title, setTitle] = useState("");

  // poll description
  const [description, setDescription] = useState("");

  // question
  const [question, setQuestion] = useState("");

  // expiry date
  const [expiresAt, setExpiresAt] = useState("");

  // poll options
  const [options, setOptions] = useState(["", ""]);

  // -----------------------------
  // HANDLE OPTION CHANGE
  // updates option input value
  // -----------------------------
  const handleOptionChange = (index, value) => {
    // copy old options
    const updated = [...options];

    // update selected option
    updated[index] = value;

    // save new options
    setOptions(updated);
  };

  // -----------------------------
  // ADD NEW OPTION INPUT
  // -----------------------------
  const addOption = () => {
    setOptions([...options, ""]);
  };

  // -----------------------------
  // CREATE POLL FUNCTION
  // sends data to backend
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

      // validate title
      if (!title.trim()) {
        toast.error("Poll title required");

        return;
      }

      // validate question
      if (!question.trim()) {
        toast.error("Question required");

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

      // success toast
      toast.success("Poll created successfully 🎉");

      // redirect dashboard
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create poll");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 py-10 px-2 flex flex-col items-center">
      {/* MAIN CARD */}
      <div className="w-full max-w-2xl bg-white/95 rounded-3xl shadow-2xl p-8 flex flex-col gap-5">
        {/* HEADER */}
        <div className="flex flex-col items-center mb-2">
          {/* LOGO */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-400 to-purple-400 flex items-center justify-center shadow-lg mb-2">
            <span className="text-3xl font-bold text-white">PB</span>
          </div>

          {/* TITLE */}
          <h1 className="text-3xl font-extrabold text-blue-700 tracking-tight mb-1">
            Create Poll
          </h1>

          {/* SUBTITLE */}
          <p className="text-gray-500 text-sm">
            Design your poll and engage your audience!
          </p>
        </div>

        {/* ----------------------------- */}
        {/* POLL TITLE */}
        {/* ----------------------------- */}

        <div>
          <input
            type="text"
            // helper text inside input
            placeholder="Enter poll title (Example: Best Programming Language)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-blue-200 p-3 rounded-lg mb-1 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base transition-all"
          />

          {/* small description */}
          <p className="text-sm text-gray-500">
            Give your poll a clear and attractive title
          </p>
        </div>

        {/* ----------------------------- */}
        {/* DESCRIPTION */}
        {/* ----------------------------- */}

        <div>
          <textarea
            placeholder="Write short description about your poll"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full border border-blue-200 p-3 rounded-lg mb-1 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base transition-all"
          />

          <p className="text-sm text-gray-500">
            Describe what users are voting for
          </p>
        </div>

        {/* ----------------------------- */}
        {/* QUESTION */}
        {/* ----------------------------- */}

        <div>
          <input
            type="text"
            placeholder="Enter your main poll question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full border border-blue-200 p-3 rounded-lg mb-1 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base transition-all"
          />

          <p className="text-sm text-gray-500">
            Ask a clear question for your audience
          </p>
        </div>

        {/* ----------------------------- */}
        {/* OPTIONS */}
        {/* ----------------------------- */}

        <div className="space-y-3">
          {options.map((option, index) => (
            <div key={index}>
              <input
                type="text"
                placeholder={`Enter option ${index + 1}`}
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="w-full border border-blue-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-base transition-all"
              />

              <p className="text-xs text-gray-500 mt-1">
                Add options users can vote for
              </p>
            </div>
          ))}
        </div>

        {/* ----------------------------- */}
        {/* ADD OPTION BUTTON */}
        {/* ----------------------------- */}

        <button
          onClick={addOption}
          className="bg-gradient-to-r from-gray-200 to-blue-100 hover:from-blue-200 hover:to-purple-100 px-4 py-2 rounded-lg text-base transition-colors w-full font-semibold"
        >
          + Add Option
        </button>

        {/* ----------------------------- */}
        {/* EXPIRY DATE */}
        {/* ----------------------------- */}

        <div>
          <input
            type="datetime-local"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            className="w-full border border-blue-200 p-3 rounded-lg mb-1 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base transition-all"
          />

          <p className="text-sm text-gray-500">
            After this date users cannot vote
          </p>
        </div>

        {/* ----------------------------- */}
        {/* CREATE BUTTON */}
        {/* ----------------------------- */}

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
