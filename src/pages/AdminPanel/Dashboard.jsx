// src/pages/admin/Dashboard.jsx
import React, { useState, useEffect } from "react";
import {
  FaUsers,
  FaBed,
  FaCalendarCheck,
  FaChartLine,
  FaUserMd,
} from "react-icons/fa";
import API from "../../api";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [stats, setStats] = useState([
    { title: "Total Patients", value: "0", icon: <FaUsers />, change: "0%" },
    { title: "Total Doctors", value: "0", icon: <FaUserMd />, change: "0%" },
    { title: "Available Rooms", value: "0", icon: <FaBed />, change: "0%" },
    { title: "Appointments Today", value: "0", icon: <FaCalendarCheck />, change: "0%" },
    { title: "Revenue", value: "₹0", icon: <FaChartLine />, change: "0%" },
  ]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const bookingsRes = await API.get("/bookings");
        const bookings = bookingsRes.data;

        const today = new Date().toISOString().split("T")[0];
        const todayAppointments = bookings.filter((booking) => {
          const bookingDate = new Date(booking.date).toISOString().split("T")[0];
          return bookingDate === today;
        });

        setStats([
          {
            title: "Total Patients",
            value: bookings.length.toString(),
            icon: <FaUsers className="text-blue-500" />,
            change: "0%",
          },
          {
            title: "Total Doctors",
            value: "0", // Replace with actual doctor count if available
            icon: <FaUserMd className="text-indigo-500" />,
            change: "0%",
          },
          {
            title: "Available Rooms",
            value: "45", // Hardcoded or fetch from backend
            icon: <FaBed className="text-green-500" />,
            change: "0%",
          },
          {
            title: "Appointments Today",
            value: todayAppointments.length.toString(),
            icon: <FaCalendarCheck className="text-purple-500" />,
            change: "0%",
          },
          {
            title: "Revenue",
            value: "₹0", // Replace with calculated revenue if needed
            icon: <FaChartLine className="text-orange-500" />,
            change: "0%",
          },
        ]);

        const activities = bookings.slice(0, 4).map((booking) => ({
          id: booking._id,
          action: `Appointment with Dr. ${booking.doctor}`,
          time: new Date(booking.date).toLocaleString(),
          status: booking.status || "Pending",
          patientName: booking.name || "Unknown Patient",
        }));

        setRecentActivities(activities);
      } catch (error) {
        console.error("Dashboard error:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
                <p className="text-sm mt-2 text-gray-500">{stat.change}</p>
              </div>
              <div className="text-3xl">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between border-b pb-4"
              >
                <div>
                  <p className="text-gray-800 font-medium">{activity.action}</p>
                  <p className="text-sm text-gray-500">{activity.patientName}</p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    activity.status === "confirmed"
                      ? "bg-green-100 text-green-800"
                      : activity.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {activity.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <button className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors">
              Add New Patient
            </button>
            <button className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors">
              Schedule Appointment
            </button>
            <button className="w-full bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 transition-colors">
              View Reports
            </button>
            <button className="w-full bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 transition-colors">
              Manage Rooms
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
