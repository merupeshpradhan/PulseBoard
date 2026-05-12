// Profile page
// Shows logged in user details

import { useEffect, useState } from "react";
import api from "../services/api";
import toast, { Toaster } from "react-hot-toast";

const Profile = () => {
  const [user, setUser] = useState(null);

  // fetch current user
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/auth/me");

        setUser(res.data.data);
      } catch (err) {
        toast.error("Failed to load profile");
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto p-2 sm:p-4">
      <Toaster position="top-right" />
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-blue-700">
        My Profile
      </h1>

      <div className="bg-white shadow rounded p-6 flex flex-col gap-3">
        <p className="mb-1 text-base sm:text-lg">
          <span className="font-semibold text-gray-700">Name:</span>{" "}
          {user?.name}
        </p>

        <p className="text-base sm:text-lg">
          <span className="font-semibold text-gray-700">Email:</span>{" "}
          {user?.email}
        </p>
      </div>
    </div>
  );
};

export default Profile;
