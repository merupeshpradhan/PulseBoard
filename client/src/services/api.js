// api.js
// This file handles ALL API requests using Axios
// Automatically attaches token to every request

import axios from "axios";

// Create axios instance
const api = axios.create({
  baseURL: "http://localhost:4000/api",
});

// -----------------------------
// REQUEST INTERCEPTOR
// Adds token to every request automatically
// -----------------------------
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
