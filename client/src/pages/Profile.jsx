// Profile.jsx
// This page:
// 1. Fetches current logged in user
// 2. Shows user profile
// 3. Uses backend getMe API
// 4. Protected profile page

import { useEffect, useState } from "react";

import api from "../services/api";

import toast from "react-hot-toast";

const Profile = () => {
  // user state
  const [user, setUser] = useState(null);

  // loading state
  const [loading, setLoading] = useState(true);

  // -----------------------------
  // FETCH CURRENT USER
  // -----------------------------
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        // backend API call
        const res = await api.get("/auth/me");

        // save user
        setUser(res.data.data);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // -----------------------------
  // LOADING UI
  // -----------------------------
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h2 className="text-xl font-semibold">Loading profile...</h2>
      </div>
    );
  }

  // -----------------------------
  // MAIN UI
  // -----------------------------
  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* PAGE TITLE */}
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      {/* PROFILE CARD */}
      <div className="bg-white shadow rounded-lg p-6 space-y-4">
        {/* USER NAME */}
        <div>
          <p className="text-gray-500 text-sm">Full Name</p>

          <h2 className="text-xl font-semibold">{user?.name}</h2>
        </div>

        {/* EMAIL */}
        <div>
          <p className="text-gray-500 text-sm">Email Address</p>

          <h2 className="text-lg">{user?.email}</h2>
        </div>

        {/* USER ID */}
        <div>
          <p className="text-gray-500 text-sm">User ID</p>

          <p className="text-sm break-all">{user?._id}</p>
        </div>

        {/* ACCOUNT CREATED */}
        <div>
          <p className="text-gray-500 text-sm">Account Created</p>

          <p>{new Date(user?.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
