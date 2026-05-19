// Profile page
// Shows logged in user details

import { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

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
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 py-10 px-2 flex flex-col items-center mt-20">
      <div className="w-full max-w-md mx-auto bg-white/95 rounded-3xl shadow-2xl p-8 flex flex-col items-center gap-6">
        <div className="flex flex-col items-center mb-2 w-full">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-400 to-purple-400 flex items-center justify-center text-white text-4xl font-extrabold mb-2 shadow-lg">
            {user?.name ? user.name[0].toUpperCase() : "U"}
          </div>
          <h1 className="text-3xl font-extrabold text-blue-700 tracking-tight mb-1">
            My Profile
          </h1>
        </div>
        <div className="w-full flex flex-col gap-2 items-center">
          <p className="text-xl font-semibold text-gray-700">{user?.name}</p>
          <p className="text-lg text-gray-500">{user?.email}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
