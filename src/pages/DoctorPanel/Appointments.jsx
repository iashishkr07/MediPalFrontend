import React, { useEffect, useState } from "react";
import doctorApi from "../../doctorApi";

const Appointments = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [formData, setFormData] = useState({
    status: "",
    timeslot: "",
    notes: "",
    date: "",
  });

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await doctorApi.get("/doctor/bookings");
        setBookings(response.data.bookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const separateAppointments = () => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    return bookings.reduce(
      (acc, booking) => {
        const bookingDate = new Date(booking.date);
        bookingDate.setHours(0, 0, 0, 0);

        if (
          bookingDate >= currentDate &&
          booking.status?.toLowerCase() !== "completed"
        ) {
          acc.upcoming.push(booking);
        } else {
          acc.past.push(booking);
        }
        return acc;
      },
      { upcoming: [], past: [] }
    );
  };

  const handleUpdateClick = (booking) => {
    setSelectedBooking(booking);
    setFormData({
      status: booking.status || "",
      timeslot: booking.timeslot || "",
      notes: booking.notes || "",
      date: booking.date
        ? new Date(booking.date).toISOString().split("T")[0]
        : "",
    });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateBooking = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      // Include all required fields from the selected booking
      const updateData = {
        ...formData,
        name: selectedBooking.name,
        email: selectedBooking.email,
        phone: selectedBooking.phone,
        doctor: selectedBooking.doctor,
        doctoremail: selectedBooking.doctoremail,
        fees: selectedBooking.fees,
      };

      const response = await doctorApi.put(
        `/bookings/${selectedBooking._id}`,
        updateData
      );

      // Update the local state with the updated booking
      setBookings(
        bookings.map((booking) =>
          booking._id === selectedBooking._id ? response.data.booking : booking
        )
      );
      setShowModal(false);
    } catch (error) {
      console.error("Error updating booking:", error);
    } finally {
      setUpdating(false);
    }
  };

  const renderUpcomingAppointmentCard = (booking) => (
    <div
      key={booking._id}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
              booking.status
            )}`}
          >
            {booking.bookingId}
          </span>
          <span className="text-sm font-medium text-gray-600">
            {new Date(booking.date).toLocaleDateString("en-US", {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-gray-900 font-semibold">{booking.name}</p>
              <p className="text-sm text-gray-500">Patient</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center text-gray-600">
              <svg
                className="w-5 h-5 text-gray-400 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <p className="text-sm">{booking.email}</p>
            </div>

            <div className="flex items-center text-gray-600">
              <svg
                className="w-5 h-5 text-gray-400 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <p className="text-sm">{booking.phone}</p>
            </div>

            <div className="flex items-center text-gray-600">
              <svg
                className="w-5 h-5 text-gray-400 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm">{booking.timeslot}</p>
            </div>
          </div>

          {booking.message && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                <span className="font-medium text-gray-700">Message: </span>
                {booking.message}
              </p>
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-gray-100">
            <button
              onClick={() => handleUpdateClick(booking)}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Update Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPastAppointmentCard = (booking) => (
    <div
      key={booking._id}
      className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:bg-gray-100 transition-colors duration-200"
    >
      <div className="flex items-center justify-between mb-3">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
            booking.status
          )}`}
        >
          {booking.bookingId}
        </span>
        <span className="text-xs text-gray-500">
          {new Date(booking.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      </div>

      <div className="space-y-2">
        <p className="font-medium text-gray-900">{booking.name}</p>
        <div className="flex items-center text-sm text-gray-600">
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {booking.timeslot}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const { upcoming, past } = separateAppointments();

  return (
    <div className="min-h-screen bg-gray-50 p-8 mt-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Appointments Section */}
          <div>
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h2 className="text-2xl font-semibold text-gray-900">
                Upcoming Appointments
              </h2>
              <span className="text-sm text-gray-500">
                Total: {upcoming.length}
              </span>
            </div>

            {upcoming.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  No upcoming appointments
                </h3>
                <p className="mt-2 text-gray-500">
                  You don't have any upcoming appointments scheduled.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcoming.map(renderUpcomingAppointmentCard)}
              </div>
            )}
          </div>

          {/* Past Appointments Section */}
          <div>
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h2 className="text-2xl font-semibold text-gray-900">
                Appointment History
              </h2>
              <span className="text-sm text-gray-500">
                Total: {past.length}
              </span>
            </div>

            {past.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  No past appointments
                </h3>
                <p className="mt-2 text-gray-500">
                  You don't have any past appointments.
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[800px] overflow-y-auto pr-2">
                {past.map(renderPastAppointmentCard)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Update Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Update Booking
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleUpdateBooking} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Time Slot
                </label>
                <input
                  type="text"
                  name="timeslot"
                  value={formData.timeslot}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="3"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:bg-blue-400"
                >
                  {updating ? "Updating..." : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
