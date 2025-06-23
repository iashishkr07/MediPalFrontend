import React, { useState, useEffect } from "react";
import axios from "axios";

const Appointment = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("");
  const [searchType, setSearchType] = useState("all");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get("https://medipalbackend.onrender.com/api/bookings");
        setBookings(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch bookings");
        setLoading(false);
        console.error("Error fetching bookings:", err);
      }
    };

    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter((booking) => {
    const searchTerm = filter.toLowerCase();

    // If no search term, show all bookings
    if (!searchTerm) return true;

    // Safely access properties with optional chaining
    const doctorName = booking?.doctor?.toLowerCase() || "";
    const patientName = booking?.name?.toLowerCase() || "";
    const patientEmail = booking?.email?.toLowerCase() || "";

    switch (searchType) {
      case "doctor":
        return doctorName.includes(searchTerm);
      case "patient":
        return (
          patientName.includes(searchTerm) || patientEmail.includes(searchTerm)
        );
      default:
        return (
          doctorName.includes(searchTerm) ||
          patientName.includes(searchTerm) ||
          patientEmail.includes(searchTerm)
        );
    }
  });

  const formatDate = (dateString) => {
    const options = { weekday: "short", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const formatDateTime = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-red-50 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-center mb-4 text-red-600">
          Error
        </h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <div className="flex justify-center">
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="mb-8">
        {/* <h1 className="text-3xl font-bold text-gray-800 mb-2"></h1> */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row gap-4 flex-grow">
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Search All</option>
              <option value="doctor">Search by Doctor</option>
              <option value="patient">Search by Patient</option>
            </select>
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder={`Search ${
                  searchType === "doctor"
                    ? "doctor"
                    : searchType === "patient"
                    ? "patient"
                    : "bookings"
                }...`}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
              <svg
                className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <div className="text-gray-600">
            Showing {filteredBookings.length} of {bookings.length} bookings
          </div>
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-8 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h3 className="text-base sm:text-lg font-medium text-gray-700 mb-2">
            {filter ? "No matching bookings found" : "No bookings available"}
          </h3>
          <p className="text-sm sm:text-base text-gray-500">
            {filter
              ? "Try a different search term"
              : "Check back later for new bookings"}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-12 bg-gray-100 p-3 sm:p-4 font-medium text-gray-700 text-sm sm:text-base">
              <div className="col-span-3 sm:col-span-2">Patient</div>
              <div className="col-span-3 sm:col-span-2">Contact</div>
              <div className="col-span-2 sm:col-span-2">Doctor</div>
              <div className="col-span-2 sm:col-span-2">Appointment Date</div>
              <div className="col-span-1 sm:col-span-2">Notes</div>
              <div className="col-span-1 sm:col-span-2">Booked On</div>
            </div>
            {filteredBookings.map((booking) => (
              <div
                key={booking._id}
                className="grid grid-cols-12 p-3 sm:p-4 border-t hover:bg-gray-50 transition-colors text-sm sm:text-base"
              >
                <div className="col-span-3 sm:col-span-2 font-medium truncate">
                  {booking.name}
                </div>
                <div className="col-span-3 sm:col-span-2">
                  <div className="text-gray-600 truncate">{booking.email}</div>
                  <div className="text-xs sm:text-sm text-gray-500">
                    {booking.phone}
                  </div>
                </div>
                <div className="col-span-2 sm:col-span-2 truncate">
                  {booking.doctor}
                </div>
                <div className="col-span-2 sm:col-span-2">
                  <div className="truncate">{formatDate(booking.date)}</div>
                  {booking.time && (
                    <div className="text-xs sm:text-sm text-gray-500">
                      {booking.time}
                    </div>
                  )}
                </div>
                <div className="col-span-1 sm:col-span-2 text-gray-600 truncate">
                  {booking.message || "-"}
                </div>
                <div className="col-span-1 sm:col-span-2 text-xs sm:text-sm text-gray-500 truncate">
                  {formatDateTime(booking.createdAt)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointment;
