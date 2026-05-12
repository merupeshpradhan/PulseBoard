// Login.jsx
// Handles user login and stores JWT token

import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // -----------------------------
  // LOGIN USER FUNCTION
  // -----------------------------
  const loginUser = async () => {
    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      // Save token
      localStorage.setItem("token", res.data.data.accessToken);

      toast.success("Login successful");

      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Login</h1>

      <input
        className="border p-2 block mb-2"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="border p-2 block mb-2"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={loginUser} className="bg-blue-600 text-white px-4 py-2">
        Login
      </button>
    </div>
  );
};

export default Login;
