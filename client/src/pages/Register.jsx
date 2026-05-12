// Register page

import { useState } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

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
    <div className="w-full max-w-sm mx-auto p-2 sm:p-4 flex flex-col justify-center min-h-[60vh] bg-white/90 rounded-2xl shadow-xl backdrop-blur-md mt-10">
      <Toaster position="top-right" />
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-purple-700 text-center">
        Register
      </h1>

      <input
        placeholder="Name"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="border border-gray-300 p-3 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm sm:text-base"
        type="text"
        autoComplete="name"
      />
      <input
        placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="border border-gray-300 p-3 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm sm:text-base"
        type="email"
        autoComplete="email"
      />
      <div className="relative mb-4">
        <input
          placeholder="Password"
          type={showPassword ? "text" : "password"}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="border border-gray-300 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm sm:text-base pr-12"
          autoComplete="new-password"
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-gray-500/50 hover:text-purple-500/50 focus:outline-none cursor-pointer"
          onClick={() => setShowPassword((prev) => !prev)}
          tabIndex={-1}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <HiEyeOff /> : <HiEye />}
        </button>
      </div>

      <button
        onClick={registerUser}
        className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded text-base font-semibold transition-colors shadow"
      >
        Register
      </button>
    </div>
  );
};

export default Register;
