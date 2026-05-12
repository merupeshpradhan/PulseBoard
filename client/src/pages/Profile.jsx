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
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      <div className="bg-white shadow rounded p-6">
        <p className="mb-3">
          <strong>Name:</strong> {user?.name}
        </p>

        <p>
          <strong>Email:</strong> {user?.email}
        </p>
      </div>
    </div>
  );
};

export default Profile;
