// All page routing defined here

import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import CreatePoll from "../pages/CreatePoll";
import PollPage from "../pages/PollPage";
import Analytics from "../pages/Analytics";
import ResultsPage from "../pages/ResultsPage";
import Profile from "../pages/Profile";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/create" element={<CreatePoll />} />
      <Route path="/poll/:id" element={<PollPage />} />
      <Route path="/analytics/:id" element={<Analytics />} />
      <Route path="/results/:id" element={<ResultsPage />} />
    </Routes>
  );
};

export default AppRoutes;
