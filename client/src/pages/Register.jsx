// Register page

import { useState } from "react";
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

  const registerUser = async () => {
    try {
      await api.post("/auth/register", form);
      toast.success("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto p-2 sm:p-4 flex flex-col justify-center min-h-[60vh]">
      <Toaster position="top-right" />
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-blue-700 text-center">
        Register
      </h1>

      <input
        placeholder="Name"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="border border-gray-300 p-3 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
        type="text"
        autoComplete="name"
      />
      <input
        placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="border border-gray-300 p-3 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
        type="email"
        autoComplete="email"
      />
      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        className="border border-gray-300 p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
        autoComplete="new-password"
      />

      <button
        onClick={registerUser}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded text-base font-semibold transition-colors shadow"
      >
        Register
      </button>
    </div>
  );
};

export default Register;
