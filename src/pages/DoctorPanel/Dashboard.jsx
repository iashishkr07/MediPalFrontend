import React, { useState, useEffect } from "react";
import {
  FaUserMd,
  FaCalendarAlt,
  FaChartLine,
  FaBell,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";
import doctorApi from "../../doctorApi";

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    totalRevenue: 0,
    notifications: 0,
  });

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await doctorApi.get("/doctor/bookings");
        const bookingsData = response.data.bookings;
        setBookings(bookingsData);

        // Calculate statistics
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Filter today's appointments
        const todayAppointments = bookingsData.filter((booking) => {
          const bookingDate = new Date(booking.date);
          bookingDate.setHours(0, 0, 0, 0);
          return bookingDate.getTime() === today.getTime();
        });

        // Calculate total revenue from all bookings
        const totalRevenue = bookingsData.reduce((sum, booking) => {
          const fees = parseFloat(booking.fees) || 0;
          return sum + fees;
        }, 0);

        // Count total patients (total number of bookings)
        const totalPatients = bookingsData.length;

        // Count pending notifications
        const pendingNotifications = bookingsData.filter(
          (booking) => booking.status === "pending"
        ).length;

        setStats({
          totalPatients: totalPatients,
          todayAppointments: todayAppointments.length,
          totalRevenue: totalRevenue,
          notifications: pendingNotifications,
        });
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 mt-12">
      <main className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
          <div className="bg-white rounded-lg shadow p-3 sm:p-4 md:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-full bg-blue-100 text-blue-600">
                <FaUserMd className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
              </div>
              <div className="ml-3 sm:ml-4">
                <h2 className="text-xs sm:text-sm text-gray-600">
                  Total Patients
                </h2>
                <p className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">
                  {stats.totalPatients}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-3 sm:p-4 md:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-full bg-green-100 text-green-600">
                <FaCalendarAlt className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
              </div>
              <div className="ml-3 sm:ml-4">
                <h2 className="text-xs sm:text-sm text-gray-600">
                  Today's Appointments
                </h2>
                <p className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">
                  {stats.todayAppointments}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-3 sm:p-4 md:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-full bg-purple-100 text-purple-600">
                <FaChartLine className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
              </div>
              <div className="ml-3 sm:ml-4">
                <h2 className="text-xs sm:text-sm text-gray-600">
                  Total Revenue
                </h2>
                <p className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">
                  ₹{stats.totalRevenue.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-3 sm:p-4 md:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-full bg-yellow-100 text-yellow-600">
                <FaBell className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
              </div>
              <div className="ml-3 sm:ml-4">
                <h2 className="text-xs sm:text-sm text-gray-600">
                  Pending Notifications
                </h2>
                <p className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">
                  {stats.notifications}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-b border-gray-200">
            <h3 className="text-base sm:text-lg font-medium text-gray-900">
              Recent Activity
            </h3>
          </div>
          <div className="p-3 sm:p-4 md:p-6">
            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              {bookings
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 5)
                .map((booking) => (
                  <div
                    key={booking._id}
                    className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <FaUserMd className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                        <h4 className="text-sm sm:text-base md:text-lg font-medium text-gray-900 truncate">
                          {booking.name}
                        </h4>
                        <span
                          className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                            booking.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : booking.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : booking.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>
                      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                        <div className="space-y-1 sm:space-y-2">
                          <p className="text-xs sm:text-sm text-gray-600 flex items-center">
                            <FaCalendarAlt className="mr-2 flex-shrink-0" />
                            <span className="truncate">
                              {new Date(booking.date).toLocaleDateString()} at{" "}
                              {booking.timeslot}
                            </span>
                          </p>
                          <p className="text-xs sm:text-sm text-gray-600 flex items-center">
                            <FaPhone className="mr-2 flex-shrink-0" />
                            <span className="truncate">{booking.phone}</span>
                          </p>
                          <p className="text-xs sm:text-sm text-gray-600 flex items-center">
                            <FaEnvelope className="mr-2 flex-shrink-0" />
                            <span className="truncate">{booking.email}</span>
                          </p>
                        </div>
                        <div className="space-y-1 sm:space-y-2">
                          <p className="text-xs sm:text-sm text-gray-600">
                            <span className="font-medium">
                              Consultation Type:
                            </span>{" "}
                            <span className="truncate">
                              {booking.type || "General Checkup"}
                            </span>
                          </p>
                          <p className="text-xs sm:text-sm text-gray-600">
                            <span className="font-medium">Fees:</span>{" "}
                            <span className="truncate">
                              ₹{Number(booking.fees || 0).toLocaleString()}
                            </span>
                          </p>
                          {booking.message && (
                            <p className="text-xs sm:text-sm text-gray-600">
                              <span className="font-medium">Message:</span>{" "}
                              <span className="truncate">
                                {booking.message}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
