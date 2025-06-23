import React, { useState } from "react";
import {
  FaHome,
  FaCalendarAlt,
  FaUserPlus,
  FaUserMd,
  FaBars,
  FaTimes,
  FaFileMedical,
  FaUpload,
  FaHeartbeat,
  FaLightbulb,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Dashboard from "./Dashboard";
import Records from "./Records";
import AddRecord from "./AddRecord";
import UploadComponent from "./Upload";
import Vitals from "./Vitals";
import PrecautionsTips from "./PrecautionsTips";
import AnimatedBackground from "./AnimatedBackground";

const UserPanel = () => {
  const [activePage, setActivePage] = useState("Dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const getUserName = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user.FullName || "User";
  };

  const renderPage = () => {
    switch (activePage) {
      case "Dashboard":
        return <Dashboard />;
      case "Records":
        return <Records />;
      case "AddRecord":
        return <AddRecord />;
      case "Upload":
        return <UploadComponent />;
      case "Vitals":
        return <Vitals />;
      case "PrecautionsTips":
        return <PrecautionsTips />;
      default:
        return <Dashboard />;
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handlePageChange = (page) => {
    setActivePage(page);
    setIsSidebarOpen(false); // Close sidebar on mobile after selection
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      className="relative flex flex-col h-screen"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <AnimatedBackground />

      {/* Top Navbar */}
      <motion.nav
        className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg relative z-10"
        variants={itemVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Title */}
            <div className="flex items-center">
              <div className="flex items-center">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 72 72"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-3"
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
                <span className="text-xl font-bold">MediPal</span>
              </div>
              <div className="ml-8 text-sm opacity-90">
                Welcome, {getUserName()}!
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/")}
                className="text-white hover:text-blue-100 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:bg-white/10"
              >
                <FaHome className="inline mr-1" />
                Home
              </button>
              <button
                onClick={handleLogout}
                className="text-white hover:text-red-100 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:bg-white/10 flex items-center"
              >
                <FaSignOutAlt className="mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Main Content with Sidebar */}
      <div className="flex flex-1 min-h-0 relative z-10">
        {/* Hamburger menu for mobile */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden fixed top-20 left-4 z-50 p-2 rounded-md bg-gray-800 text-white shadow-md hover:bg-gray-700 transition-colors duration-300"
          aria-label="Open sidebar menu"
        >
          <FaBars />
        </button>

        {/* Sidebar overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-40 lg:hidden"
            onClick={toggleSidebar}
            aria-label="Close sidebar overlay"
          ></div>
        )}

        {/* Sidebar */}
        <motion.div
          className={`${
            isSidebarOpen ? "block translate-x-0" : "hidden -translate-x-full"
          } fixed lg:static lg:block lg:translate-x-0 h-full bg-white/80 dark:bg-gray-900/90 shadow-lg transition-transform duration-300 ease-in-out z-50 border-r border-gray-300/20 w-4/5 max-w-xs lg:w-64 backdrop-blur-md`}
          variants={itemVariants}
          style={{ height: "100%" }}
        >
          {/* Close icon for mobile sidebar */}
          <div className="flex justify-end lg:hidden">
            <button
              onClick={toggleSidebar}
              className="p-3 text-gray-700 dark:text-gray-200 hover:text-red-500"
              aria-label="Close sidebar menu"
            >
              <FaTimes size={22} />
            </button>
          </div>
          <nav className="p-4 pt-0 lg:pt-4">
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handlePageChange("Dashboard")}
                  className={`w-full text-left p-3 rounded-md transition-all duration-300 text-base md:text-sm ${
                    activePage === "Dashboard"
                      ? "bg-blue-500/10 text-blue-600 border border-blue-500/30 shadow-lg backdrop-blur-sm"
                      : "text-gray-800 dark:text-gray-200 hover:bg-gray-200/50 hover:text-gray-900 dark:hover:text-white backdrop-blur-sm"
                  }`}
                >
                  <FaHome className="inline mr-2" /> Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => handlePageChange("Records")}
                  className={`w-full text-left p-3 rounded-md transition-all duration-300 text-base md:text-sm ${
                    activePage === "Records"
                      ? "bg-blue-500/10 text-blue-600 border border-blue-500/30 shadow-lg backdrop-blur-sm"
                      : "text-gray-800 dark:text-gray-200 hover:bg-gray-200/50 hover:text-gray-900 dark:hover:text-white backdrop-blur-sm"
                  }`}
                >
                  <FaFileMedical className="inline mr-2" /> Records
                </button>
              </li>
              <li>
                <button
                  onClick={() => handlePageChange("AddRecord")}
                  className={`w-full text-left p-3 rounded-md transition-all duration-300 text-base md:text-sm ${
                    activePage === "AddRecord"
                      ? "bg-blue-500/10 text-blue-600 border border-blue-500/30 shadow-lg backdrop-blur-sm"
                      : "text-gray-800 dark:text-gray-200 hover:bg-gray-200/50 hover:text-gray-900 dark:hover:text-white backdrop-blur-sm"
                  }`}
                >
                  <FaUserPlus className="inline mr-2" /> Add Record
                </button>
              </li>
              <li>
                <button
                  onClick={() => handlePageChange("Upload")}
                  className={`w-full text-left p-3 rounded-md transition-all duration-300 text-base md:text-sm ${
                    activePage === "Upload"
                      ? "bg-blue-500/10 text-blue-600 border border-blue-500/30 shadow-lg backdrop-blur-sm"
                      : "text-gray-800 dark:text-gray-200 hover:bg-gray-200/50 hover:text-gray-900 dark:hover:text-white backdrop-blur-sm"
                  }`}
                >
                  <FaUpload className="inline mr-2" /> Upload
                </button>
              </li>
              <li>
                <button
                  onClick={() => handlePageChange("Vitals")}
                  className={`w-full text-left p-3 rounded-md transition-all duration-300 text-base md:text-sm ${
                    activePage === "Vitals"
                      ? "bg-blue-500/10 text-blue-600 border border-blue-500/30 shadow-lg backdrop-blur-sm"
                      : "text-gray-800 dark:text-gray-200 hover:bg-gray-200/50 hover:text-gray-900 dark:hover:text-white backdrop-blur-sm"
                  }`}
                >
                  <FaHeartbeat className="inline mr-2" /> Vitals
                </button>
              </li>
              <li>
                <button
                  onClick={() => handlePageChange("PrecautionsTips")}
                  className={`w-full text-left p-3 rounded-md transition-all duration-300 text-base md:text-sm ${
                    activePage === "PrecautionsTips"
                      ? "bg-blue-500/10 text-blue-600 border border-blue-500/30 shadow-lg backdrop-blur-sm"
                      : "text-gray-800 dark:text-gray-200 hover:bg-gray-200/50 hover:text-gray-900 dark:hover:text-white backdrop-blur-sm"
                  }`}
                >
                  <FaLightbulb className="inline mr-2" /> Precautions & Tips
                </button>
              </li>
            </ul>
          </nav>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto min-h-0 text-gray-200 transition-all duration-300">
          {renderPage()}
        </div>
      </div>
    </motion.div>
  );
};

export default UserPanel;
