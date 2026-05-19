// Login.jsx
// Handles user login and stores JWT token

import { useState } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

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
    <div className="min-h-full flex items-center justify-center from-blue-200 via-purple-100 to-pink-100 px-2 mt-20">
      <div className="w-full max-w-md bg-white/95 rounded-3xl shadow-2xl p-8 flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-400 to-purple-400 flex items-center justify-center mb-4 shadow-lg">
          <span className="text-4xl font-bold text-white">PB</span>
        </div>
        <h1 className="text-3xl font-extrabold mb-2 text-blue-700 text-center tracking-tight">
          Welcome Back
        </h1>
        <p className="text-gray-500 mb-6 text-center text-sm">
          Login to PulseBoard to manage your polls!
        </p>

        <input
          className="border border-blue-200 p-3 rounded-lg mb-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-base transition-all"
          placeholder="Email Address"
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          autoComplete="email"
        />

        <div className="relative mb-4 w-full">
          <input
            className="border border-blue-200 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-base pr-12 transition-all"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-2xl text-blue-400/60 hover:text-blue-600/80 focus:outline-none cursor-pointer"
            onClick={() => setShowPassword((prev) => !prev)}
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <HiEyeOff /> : <HiEye />}
          </button>
        </div>

        <button
          onClick={loginUser}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-500 hover:from-blue-700 hover:to-purple-600 text-white py-3 rounded-lg text-lg font-semibold transition-all shadow-lg mb-2 mt-2"
        >
          Login
        </button>
        <div className="mt-3 text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 hover:underline font-medium"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
