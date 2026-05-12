// Login.jsx
// Handles user login and stores JWT token

import { useState } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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

      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto p-2 sm:p-4 flex flex-col justify-center min-h-[60vh] bg-white/90 rounded-2xl shadow-xl backdrop-blur-md mt-10">
      <Toaster position="top-right" />
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-blue-700 text-center">
        Login
      </h1>

      <input
        className="border border-gray-300 p-3 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        autoComplete="email"
      />

      <div className="relative mb-4">
        <input
          className="border border-gray-300 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base pr-12"
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-gray-500/50 hover:text-blue-500/50 focus:outline-none cursor-pointer"
          onClick={() => setShowPassword((prev) => !prev)}
          tabIndex={-1}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <HiEyeOff /> : <HiEye />}
        </button>
      </div>

      <button
        onClick={loginUser}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded text-base font-semibold transition-colors shadow"
      >
        Login
      </button>
    </div>
  );
};

export default Login;
