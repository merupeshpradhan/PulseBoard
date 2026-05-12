import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const CreatePoll = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState("");

  const [options, setOptions] = useState(["", ""]);

  // add new option
  const addOption = () => {
    setOptions([...options, ""]);
  };

  // update option
  const updateOption = (value, index) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  // create poll
  const createPoll = async () => {
    await api.post("/polls/create", {
      title,
      allowAnonymous: true,
      expiresAt: "2027-01-01T00:00:00.000Z",
      questions: [
        {
          question,
          options: options.filter((opt) => opt.trim() !== ""),
        },
      ],
    });

    navigate("/");
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Create Poll</h1>

      {/* TITLE */}
      <input
        className="border p-2 w-full mb-3"
        placeholder="Title"
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* QUESTION */}
      <input
        className="border p-2 w-full mb-3"
        placeholder="Question"
        onChange={(e) => setQuestion(e.target.value)}
      />

      {/* OPTIONS */}
      <h3 className="font-semibold mb-2">Options</h3>

      {options.map((opt, index) => (
        <input
          key={index}
          className="border p-2 w-full mb-2"
          placeholder={`Option ${index + 1}`}
          value={opt}
          onChange={(e) => updateOption(e.target.value, index)}
        />
      ))}

      {/* ADD OPTION BUTTON */}
      <button onClick={addOption} className="bg-gray-200 px-3 py-1 mb-3">
        + Add Option
      </button>

      {/* CREATE BUTTON */}
      <button
        onClick={createPoll}
        className="bg-blue-600 text-white px-4 py-2 w-full"
      >
        Create Poll
      </button>
    </div>
  );
};

export default CreatePoll;
