// Navbar.jsx
// This navbar:
// 1. Checks login status
// 2. Fetches current user using getMe API
// 3. Shows username
// 4. Handles logout
// 5. Hides dashboard/create on public poll page

import { Link, useLocation, useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";

import api from "../services/api";

const Navbar = () => {
  // page navigation
  const navigate = useNavigate();

  // current route
  const location = useLocation();

  // logged in token
  const token = localStorage.getItem("token");

  // current user state
  const [user, setUser] = useState(null);

  // -----------------------------
  // FETCH CURRENT USER
  // calls backend getMe API
  // -----------------------------
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        // if no token stop request
        if (!token) return;

        // backend request
        const res = await api.get("/auth/me");

        // save user data
        setUser(res.data.data);
      } catch (err) {
        console.log("Failed to fetch user");
      }
    };

    fetchCurrentUser();
  }, [token]);

  // -----------------------------
  // LOGOUT FUNCTION
  // removes token
  // -----------------------------
  const handleLogout = () => {
    // remove token
    localStorage.removeItem("token");

    // clear user state
    setUser(null);

    // redirect login
    navigate("/login");
  };

  // -----------------------------
  // CHECK PUBLIC POLL PAGE
  // -----------------------------
  const isPublicPollPage = location.pathname.startsWith("/poll/");

  return (
    <div className="bg-white shadow p-4 flex justify-between items-center">
      {/* LOGO */}
      <h1 className="font-bold text-lg">Poll Platform</h1>

      <div className="flex gap-4 items-center">
        {/* ----------------------------- */}
        {/* IF USER LOGGED IN */}
        {/* ----------------------------- */}
        {token ? (
          <>
            {/* show username */}
            <p className="font-medium text-gray-700">
              Hello, {user?.name || "User"}
            </p>

            {/* hide dashboard/create on public poll page */}
            {!isPublicPollPage && (
              <>
                <Link to="/">Dashboard</Link>

                <Link to="/profile">Profile</Link>

                <Link to="/create">Create Poll</Link>
              </>
            )}

            {/* logout button */}
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            {/* ----------------------------- */}
            {/* NOT LOGGED IN */}
            {/* ----------------------------- */}

            <Link to="/login">Login</Link>

            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
