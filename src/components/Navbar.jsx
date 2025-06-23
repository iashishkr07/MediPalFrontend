import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // Mobile menu state
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/");
  };

  // Navigation links for reuse (main links only)
  const navLinks = (
    <>
      <Link
        to="/"
        className="text-white hover:text-blue-100 px-3 py-2 rounded-full text-base font-semibold transition-all duration-300 hover:bg-white/10 backdrop-blur-sm hover:scale-105 hover:shadow-lg flex items-center"
        onClick={() => setMenuOpen(false)}
      >
        Home
      </Link>
      <Link
        to="/appointments"
        className="text-white hover:text-blue-100 px-3 py-2 rounded-full text-base font-semibold transition-all duration-300 hover:bg-white/10 backdrop-blur-sm hover:scale-105 hover:shadow-lg flex items-center"
        onClick={() => setMenuOpen(false)}
      >
        Appointments
      </Link>
       <Link
        to="/ai-analyze"
        className="text-white hover:text-blue-100 px-3 py-2 rounded-full text-base font-semibold transition-all duration-300 hover:bg-white/10 backdrop-blur-sm hover:scale-105 hover:shadow-lg flex items-center"
        onClick={() => setMenuOpen(false)}
      >
        Visual Medical Assistant
      </Link>
    </>
  );

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="flex justify-between items-center h-20 md:h-28 relative">
          {/* Logo */}
          <div className="flex items-center h-full flex-shrink-0">
            <Link
              to="/"
              className="flex items-center group h-full"
              onClick={() => setMenuOpen(false)}
            >
              <svg
                width="56"
                height="56"
                viewBox="0 0 72 72"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2 md:mr-3 self-center"
                style={{ display: "block" }}
              >
                <defs>
                  <radialGradient id="medipal-blue" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#2563eb" />
                  </radialGradient>
                </defs>
                <circle cx="36" cy="36" r="33" fill="url(#medipal-blue)" />
                <polyline
                  points="21,48 27,24 36,39 45,24 51,48"
                  stroke="#fff"
                  strokeWidth="3.5"
                  fill="none"
                  strokeLinejoin="round"
                />
                <rect
                  x="32.25"
                  y="30"
                  width="7.5"
                  height="1.8"
                  rx="0.9"
                  fill="#fff"
                />
                <rect
                  x="34.8"
                  y="27.3"
                  width="1.8"
                  height="7.5"
                  rx="0.9"
                  fill="#fff"
                />
                <path
                  d="M36 43.5
                     C37.5 41.25 42 42 42 45
                     C42 47.25 39.75 48.75 36 51
                     C32.25 48.75 30 47.25 30 45
                     C30 42 34.5 41.25 36 43.5Z"
                  fill="#ff6b81"
                  stroke="#fff"
                  strokeWidth="1.5"
                />
              </svg>
              <span
                style={{
                  fontFamily: "Segoe UI, Roboto, Arial, sans-serif",
                  fontWeight: 700,
                }}
                className="text-2xl sm:text-3xl md:text-4xl text-white tracking-wide pr-2 md:pr-4"
              >
                MediPal
              </span>
            </Link>
          </div>

          {/* Hamburger for mobile */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-blue-100 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                // Close icon
                <svg
                  className="h-7 w-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                // Hamburger icon
                <svg
                  className="h-7 w-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center justify-center flex-1">
            <div className="flex space-x-1 md:space-x-2 lg:space-x-4 items-center">
              {navLinks}
            </div>
          </div>

          {/* Actions (right side) */}
          <div className="hidden lg:flex items-center space-x-1 md:space-x-2 lg:space-x-4">
            {isLoggedIn ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-white hover:text-blue-100 px-3 sm:px-4 py-2 rounded-full text-base font-semibold transition-all duration-300 hover:bg-white/10 backdrop-blur-sm flex items-center"
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-white hover:text-blue-100 px-3 sm:px-4 py-2 rounded-full text-base font-semibold transition-all duration-300 hover:bg-white/10 backdrop-blur-sm flex items-center"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-white bg-black/20 hover:bg-black/40 px-3 sm:px-4 py-2 rounded-full text-base font-semibold transition-all duration-300 backdrop-blur-sm flex items-center"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/doctor-login"
                  className="text-white hover:text-blue-100 px-3 sm:px-4 py-2 rounded-full text-base font-semibold transition-all duration-300 hover:bg-white/10 backdrop-blur-sm flex items-center"
                  onClick={() => setMenuOpen(false)}
                >
                  Doctor Login
                </Link>

                <Link
                  to="/signup"
                  className="bg-white text-blue-600 px-3 sm:px-4 py-2 rounded-full text-base font-semibold shadow-lg hover:bg-gray-200 transition-all duration-300 flex items-center"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks}
            {/* Mobile actions */}
            <div className="border-t border-gray-700 mt-4 pt-4">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center space-x-2">
                  {isLoggedIn ? (
                    <>
                      <Link
                        to="/dashboard"
                        className="block text-white hover:text-blue-100 px-3 py-2 rounded-md text-base font-medium"
                        onClick={() => setMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block text-white hover:text-blue-100 px-3 py-2 rounded-md text-base font-medium"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="block text-white hover:text-blue-100 px-3 py-2 rounded-md text-base font-medium"
                        onClick={() => setMenuOpen(false)}
                      >
                        Login
                      </Link>
                      <Link
                        to="/doctor-login"
                        className="block text-white hover:text-blue-100 px-3 py-2 rounded-md text-base font-medium"
                        onClick={() => setMenuOpen(false)}
                      >
                        Doctor Login
                      </Link>
                      <Link
                        to="/signup"
                        className="block bg-white text-blue-600 px-4 py-2 rounded-md text-base font-semibold shadow-lg"
                        onClick={() => setMenuOpen(false)}
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
