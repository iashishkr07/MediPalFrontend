import React, { useState } from "react";
import { FaHome, FaCalendarAlt, FaBars, FaTimes } from "react-icons/fa";
import Dashboard from "./Dashboard";
import Appointments from "./Appointments";
import UserMedicalReport from "./UserMedicalReport";

const DoctorPanel = () => {
  const [activePage, setActivePage] = useState("Dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderPage = () => {
    switch (activePage) {
      case "Dashboard":
        return <Dashboard />;
      case "Appointments":
        return <Appointments />;
      case "UserMedicalReport":
        return <UserMedicalReport />;
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

  return (
    <div className="flex min-h-screen bg-gray-100">
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-16 left-4 z-51 p-2 rounded-md bg-white shadow-md"
      >
        {isSidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      <div
        className={`
        fixed lg:fixed top-16 lg:top-24 bottom-0 lg:bottom-24 left-0 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 ease-in-out z-50 w-64 bg-white lg:bg-transparent`}
      >
        <div className="h-full p-6 flex flex-col justify-start">
          <div className="space-y-6 text-gray-800">
            <div
              onClick={() => handlePageChange("Dashboard")}
              className="flex items-center gap-3 cursor-pointer hover:text-blue-600"
            >
              <FaHome /> <span>Dashboard</span>
            </div>
            <div
              onClick={() => handlePageChange("Appointments")}
              className="flex items-center gap-3 cursor-pointer hover:text-blue-600"
            >
              <FaCalendarAlt /> <span>Appointments</span>
            </div>
            <div
              onClick={() => handlePageChange("UserMedicalReport")}
              className="flex items-center gap-3 cursor-pointer hover:text-blue-600"
            >
              <span>User Medical Report</span>
            </div>
          </div>
        </div>
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden pointer-events-none"
          onClick={toggleSidebar}
        />
      )}

      <div className="flex-1 p-4 lg:p-6 w-full lg:ml-64">
        <div className="mt-12 lg:mt-0">{renderPage()}</div>
      </div>
    </div>
  );
};

export default DoctorPanel;
