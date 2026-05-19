// Register page

import { useState } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const registerUser = async () => {
    try {
      await api.post("/auth/register", form);
      toast.success("Registration successful! Please login.");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-full flex items-center justify-center from-purple-200 via-blue-100 to-pink-100 py-2 px-2 mt-10">
      <div className="w-full max-w-md bg-white/95 rounded-3xl shadow-2xl p-8 flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-400 to-blue-400 flex items-center justify-center mb-4 shadow-lg">
          <span className="text-4xl font-bold text-white">PB</span>
        </div>
        <h1 className="text-3xl font-extrabold mb-2 text-purple-700 text-center tracking-tight">
          Create Account
        </h1>
        <p className="text-gray-500 mb-6 text-center text-sm">
          Join PulseBoard and start creating interactive polls!
        </p>

        <input
          placeholder="Full Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border border-purple-200 p-3 rounded-lg mb-3 w-full focus:outline-none focus:ring-2 focus:ring-purple-400 text-base transition-all"
          type="text"
          autoComplete="name"
        />
        <input
          placeholder="Email Address"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border border-purple-200 p-3 rounded-lg mb-3 w-full focus:outline-none focus:ring-2 focus:ring-purple-400 text-base transition-all"
          type="email"
          autoComplete="email"
        />
        <div className="relative mb-4 w-full">
          <input
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="border border-purple-200 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-400 text-base pr-12 transition-all"
            autoComplete="new-password"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-2xl text-purple-400/60 hover:text-purple-600/80 focus:outline-none cursor-pointer"
            onClick={() => setShowPassword((prev) => !prev)}
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <HiEyeOff /> : <HiEye />}
          </button>
        </div>

        <button
          onClick={registerUser}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white py-3 rounded-lg text-lg font-semibold transition-all shadow-lg mb-2 mt-2"
        >
          Register
        </button>
        <div className="mt-3 text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/" className="text-purple-600 hover:underline font-medium">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
