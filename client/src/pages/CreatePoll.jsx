// Create poll page

import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const CreatePoll = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState("");

  const createPoll = async () => {
    await api.post("/polls/create", {
      title,
      allowAnonymous: true,
      expiresAt: "2027-01-01T00:00:00.000Z",
      questions: [
        {
          question,
          options: ["A", "B", "C"],
        },
      ],
    });

    navigate("/");
  };

  return (
    <div>
      <h1>Create Poll</h1>

      <input placeholder="Title" onChange={(e) => setTitle(e.target.value)} />
      <input
        placeholder="Question"
        onChange={(e) => setQuestion(e.target.value)}
      />

      <button onClick={createPoll}>Create</button>
    </div>
  );
};

export default CreatePoll;
