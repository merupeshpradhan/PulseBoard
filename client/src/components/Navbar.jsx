import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { HiMenu, HiX } from "react-icons/hi"; 
import { HiMenu as MenuIcon, HiX as CloseIcon } from "react-icons/hi";
import api from "../services/api";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // LISTEN TO STORAGE CHANGES
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // FETCH CURRENT USER
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const activeToken = localStorage.getItem("token");

      if (!activeToken) {
        setUser(null);
        return;
      }

      try {
        // 💡 FIXED: Passes token explicitly in the request headers to eliminate refresh lag!
        const res = await api.get("/auth/me", {
          headers: {
            Authorization: `Bearer ${activeToken}`,
          },
        });

        // 💡 FIXED DATA EXTRACTION: Tries nested data object first, falls back to direct base payload object
        const profileData = res.data?.data || res.data;
        setUser(profileData);
      } catch (err) {
        console.error("Profile load or token check validation failed:", err);
        // Only wipe the token if the server explicitly tells us the authentication failed (401/403)
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem("token");
          setUser(null);
          navigate("/");
        }
      }
    };

    fetchCurrentUser();
  }, [token, location.pathname]); // Removed navigate from dependencies to prevent infinite render loops

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("storage"));
    setUser(null);
    setMenuOpen(false);
    navigate("/");
  };

  const isPublicPollPage = location.pathname.startsWith("/poll/");

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-lg px-4 sm:px-8 py-3 flex justify-between items-center w-full sticky top-0 z-30 rounded-b-2xl border-b border-gray-200">
      {/* LOGO */}
      <Link
        to={user ? "/dashboard" : "/"}
        className="font-extrabold text-xl sm:text-2xl text-blue-700 tracking-tight select-none drop-shadow"
      >
        PulseBoard
      </Link>

      {/* Hamburger for mobile */}
      <button
        className="sm:hidden flex items-center text-2xl text-blue-700 focus:outline-none ml-auto"
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
      >
        {menuOpen ? <CloseIcon /> : <MenuIcon />}
      </button>

      {/* Desktop menu */}
      <div className="hidden sm:flex gap-2 sm:gap-4 items-center flex-wrap">
        {user ? (
          <>
            <p className="font-medium text-gray-700 text-sm sm:text-base truncate max-w-full sm:max-w-xs mr-2">
              Hello, {user?.name || "User"}
            </p>
            {!isPublicPollPage && (
              <>
                <Link
                  to="/dashboard"
                  className="hover:text-blue-600 transition-colors text-sm sm:text-base font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className="hover:text-blue-600 transition-colors text-sm sm:text-base font-medium"
                >
                  Profile
                </Link>
                <Link
                  to="/create"
                  className="hover:text-blue-600 transition-colors text-sm sm:text-base font-medium"
                >
                  Create Poll
                </Link>
              </>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm sm:text-base transition-colors font-medium ml-2 cursor-pointer"
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
        <div className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-md shadow-lg flex flex-col items-center gap-4 py-4 z-40 sm:hidden rounded-b-2xl border-b border-gray-200">
          {user ? (
            <>
              <p className="font-medium text-gray-700 text-base truncate max-w-full">
                Hello, {user?.name || "User"}
              </p>
              {!isPublicPollPage && (
                <>
                  <Link
                    to="/dashboard"
                    className="hover:text-blue-600 transition-colors text-base font-medium"
                    onClick={() => setMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    className="hover:text-blue-600 transition-colors text-base font-medium"
                    onClick={() => setMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/create"
                    className="hover:text-blue-600 transition-colors text-base font-medium"
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
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg text-base transition-colors mt-2 font-medium cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/"
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
