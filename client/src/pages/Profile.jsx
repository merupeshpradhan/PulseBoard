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
    <div className="w-full max-w-md mx-auto p-2 sm:p-4 mt-10">
      <Toaster position="top-right" />
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-blue-700 text-center">
        My Profile
      </h1>

      <div className="bg-white/90 rounded-2xl shadow-xl backdrop-blur-md p-8 flex flex-col items-center gap-4">
        {/* Avatar */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white text-3xl font-bold mb-2 shadow-lg">
          {user?.name ? user.name[0].toUpperCase() : "U"}
        </div>
        <div className="w-full flex flex-col gap-2 items-center">
          <p className="text-lg sm:text-xl font-semibold text-gray-700">
            {user?.name}
          </p>
          <p className="text-base sm:text-lg text-gray-500">{user?.email}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
