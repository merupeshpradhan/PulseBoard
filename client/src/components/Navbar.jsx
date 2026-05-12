// Navbar.jsx
// This navbar:
// 1. Checks login status
// 2. Fetches current user using getMe API
// 3. Shows username
// 4. Handles logout
// 5. Hides dashboard/create on public poll page

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
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
  // mobile menu state
  const [menuOpen, setMenuOpen] = useState(false);

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
        console.log("Token expired!");
        localStorage.removeItem("token"); // This is the key!
        setUser(null);
        navigate("/");
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
    navigate("/");
  };

  // -----------------------------
  // CHECK PUBLIC POLL PAGE
  // -----------------------------
  const isPublicPollPage = location.pathname.startsWith("/poll/");

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-lg px-4 sm:px-8 py-3 flex justify-between items-center w-full sticky top-0 z-30 rounded-b-2xl border-b border-gray-200">
      {/* LOGO */}
      <h1 className="font-extrabold text-xl sm:text-2xl text-blue-700 tracking-tight select-none drop-shadow">
        PulseBoard
      </h1>

      {/* Hamburger for mobile */}
      <button
        className="sm:hidden flex items-center text-2xl text-blue-700 focus:outline-none ml-auto"
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
      >
        {menuOpen ? <HiX /> : <HiMenu />}
      </button>

      {/* Desktop menu */}
      <div className="hidden sm:flex gap-2 sm:gap-4 items-center flex-wrap">
        {user ? (
          <>
            <p className="font-medium text-gray-700 text-sm sm:text-base truncate max-w-[120px] sm:max-w-xs">
              Hello, {user?.name || "User"}
            </p>
            {!isPublicPollPage && (
              <>
                <Link
                  to="/dashboard"
                  className="hover:text-blue-600 transition-colors text-sm sm:text-base"
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className="hover:text-blue-600 transition-colors text-sm sm:text-base"
                >
                  Profile
                </Link>
                <Link
                  to="/create"
                  className="hover:text-blue-600 transition-colors text-sm sm:text-base"
                >
                  Create Poll
                </Link>
              </>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm sm:text-base transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/"
              className="px-4 py-1 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm sm:text-base transition-colors shadow"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-1 rounded-lg bg-purple-500 hover:bg-purple-600 text-white font-semibold text-sm sm:text-base transition-colors shadow"
            >
              Register
            </Link>
          </>
        )}
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white/95 backdrop-blur-md shadow-lg flex flex-col items-center gap-4 py-6 z-40 sm:hidden animate-fade-in rounded-b-2xl border-b border-gray-200">
          {user ? (
            <>
              <p className="font-medium text-gray-700 text-base truncate max-w-[160px]">
                Hello, {user?.name || "User"}
              </p>
              {!isPublicPollPage && (
                <>
                  <Link
                    to="/"
                    className="hover:text-blue-600 transition-colors text-base"
                    onClick={() => setMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    className="hover:text-blue-600 transition-colors text-base"
                    onClick={() => setMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/create"
                    className="hover:text-blue-600 transition-colors text-base"
                    onClick={() => setMenuOpen(false)}
                  >
                    Create Poll
                  </Link>
                </>
              )}
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-base transition-colors mt-2"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold text-base transition-colors shadow w-32 text-center"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-lg bg-purple-500 hover:bg-purple-600 text-white font-semibold text-base transition-colors shadow w-32 text-center"
                onClick={() => setMenuOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
