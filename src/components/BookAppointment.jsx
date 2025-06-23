import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaClock,
  FaSearch,
  FaArrowRight,
  FaCheckCircle,
  FaStethoscope,
} from "react-icons/fa";
import API from "../api.js";
import { useNavigate } from "react-router-dom";
import { useSpring, animated } from "@react-spring/web";

const BookAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    bookingId: "",
    aadharNo: "",
    name: "",
    email: "",
    phone: "",
    doctor: "",
    doctoremail: "",
    fees: "",
    timeslot: "",
    date: "",
    message: "",
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const timeSlots = [
    "09:00 AM - 10:00",
    "10:00 AM - 11:00",
    "11:00 AM - 12:00",
    "12:00 PM - 01:00",
    "02:00 PM - 03:00",
    "03:00 PM - 04:00",
    "04:00 PM - 05:00",
  ];

  // Utility function to generate next 7 days
  const getNext7Days = () => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push({
        value: date.toISOString().split("T")[0],
        label: date.toLocaleDateString(undefined, {
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
      });
    }
    return days;
  };

  const next7Days = getNext7Days();

  const dateCarouselRef = useRef(null);
  const timeCarouselRef = useRef(null);

  const scrollCarousel = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = 150;
      ref.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    // Check login status
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    // Fetch user's info
    const fetchUserInfo = async () => {
      try {
        const response = await API.get("/me");
        if (response.data.success && response.data.user) {
          setFormData((prev) => ({
            ...prev,
            aadharNo: response.data.user.AadharNo || prev.aadharNo,
            name: response.data.user.FullName || prev.name,
            email: response.data.user.Email || prev.email,
            phone: response.data.user.Phone || prev.phone,
          }));
        }
      } catch (err) {
        // Optionally show a toast or handle error
        console.error("Error fetching user info:", err.message);
      }
    };
    fetchUserInfo();

    // Existing fetchDoctors logic
    const fetchDoctors = async () => {
      try {
        const response = await API.get("/doctors");
        if (Array.isArray(response.data)) {
          // Get one doctor from each department
          const departments = {};
          response.data.forEach((doctor) => {
            if (!departments[doctor.speciality]) {
              departments[doctor.speciality] = doctor;
            }
          });
          setDoctors(Object.values(departments));
        }
      } catch (err) {
        console.error("Error fetching doctors:", err.message);
        toast.error("Failed to load doctors. Please try again later.");
      }
    };
    fetchDoctors();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateForm = () => {
    const errors = [];
    if (!formData.aadharNo || !/^\d{12}$/.test(formData.aadharNo)) {
      errors.push("Aadhar number must be a 12-digit number.");
    }
    if (!formData.name) errors.push("Name is required.");
    if (!formData.email) errors.push("Email is required.");
    if (!formData.phone) errors.push("Phone is required.");
    if (!formData.doctor) errors.push("Doctor is required.");
    if (!formData.doctoremail) errors.push("Doctor email is required.");
    if (!formData.fees) errors.push("Fees is required.");
    if (!formData.timeslot) errors.push("Time slot is required.");
    if (!formData.date) errors.push("Date is required.");
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (errors.length > 0) {
      errors.forEach((err) => toast.error(err));
      return;
    }
    // Generate a random bookingId (e.g., 10-digit number)
    const randomBookingId = Math.floor(
      1000000000 + Math.random() * 9000000000
    ).toString();
    try {
      const response = await API.post("/book-appointment", {
        ...formData,
        bookingId: randomBookingId,
      });

      if (response.status === 200 || response.status === 201) {
        toast.success("Appointment booked successfully!");
        setFormData({
          aadharNo: "",
          name: "",
          email: "",
          phone: "",
          doctor: "",
          doctoremail: "",
          fees: "",
          timeslot: "",
          date: "",
          message: "",
        });
        setSelectedDoctor(null);
      } else {
        toast.error(response.data?.message || "Failed to book appointment");
      }
    } catch (error) {
      toast.error("Error submitting form. Please try again.");
    }
  };

  // Update filteredDoctors to filter by more fields
  const filteredDoctors = doctors.filter((doctor) => {
    const term = searchTerm.trim().toLowerCase();
    return (
      doctor.name?.toLowerCase().includes(term) ||
      doctor.speciality?.toLowerCase().includes(term) ||
      doctor.degree?.toLowerCase().includes(term) ||
      doctor.experience?.toLowerCase().includes(term) ||
      (doctor.address &&
        ((doctor.address.street || "") + " " + (doctor.address.city || ""))
          .toLowerCase()
          .includes(term))
    );
  });

  const bgSpring = useSpring({
    from: { backgroundPosition: "0% 50%" },
    to: { backgroundPosition: "100% 50%" },
    config: { duration: 12000 },
    loop: { reverse: true },
    background:
      "linear-gradient(120deg, #232b3e 0%, #2d3654 50%, #1a1f2e 100%)",
    backgroundSize: "200% 200%",
  });

  // Entrance animation: fade in and slide up
  const entranceSpring = useSpring({
    from: { opacity: 0, transform: "translateY(40px)" },
    to: { opacity: 1, transform: "translateY(0px)" },
    config: { tension: 120, friction: 18 },
  });

  return (
    <>
      <Navbar />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <animated.div style={entranceSpring}>
        <animated.div
          style={{
            ...bgSpring,
            minHeight: "100vh",
            paddingTop: "5rem",
            paddingBottom: "1.5rem",
            paddingLeft: "0.25rem",
            paddingRight: "0.25rem",
          }}
          className="sm:px-2 md:px-4 lg:px-8 flex flex-col relative"
        >
          {/* Top Search Bar */}
          <div className="w-full max-w-6xl mx-auto mb-4 flex flex-col sm:flex-row items-center gap-3 px-2 md:px-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white flex-1 text-center sm:text-left">
              Make appointment
            </h1>
            <div className="relative w-full sm:w-80 md:w-96">
              <input
                type="text"
                placeholder="Search doctors, services..."
                className="w-full px-3 py-2 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#232b3e] text-white shadow-md placeholder-gray-400 text-sm md:text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
            </div>
          </div>

          <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-8">
            {/* Left: Categories, Doctor List, Booking Form */}
            <div className="lg:col-span-7 flex flex-col gap-4 md:gap-6">
              {/* Doctor Cards - now wrapping instead of horizontal scroll */}
              <div className="w-full pb-2">
                <div className="flex flex-wrap gap-4 md:gap-6 justify-center md:justify-start">
                  {filteredDoctors.length === 0 && (
                    <div className="text-center text-gray-400 py-8 w-full">
                      No doctors found.
                    </div>
                  )}
                  {filteredDoctors.map((doctor) => {
                    const selected = selectedDoctor?._id === doctor._id;
                    return (
                      <div
                        key={doctor._id}
                        className={`rounded-2xl p-4 md:p-6 bg-[#232b3e] shadow-2xl border-2 ${
                          selected ? "border-blue-500" : "border-transparent"
                        } flex flex-col items-center w-44 min-w-[160px] md:w-56 md:min-w-[220px] cursor-pointer transition-all duration-300 hover:scale-105`}
                        onClick={() => {
                          setSelectedDoctor(doctor);
                          setFormData((prev) => ({
                            ...prev,
                            doctor: doctor.name,
                            doctoremail: doctor.email,
                            fees: doctor.fees,
                          }));
                        }}
                      >
                        <img
                          src={
                            doctor.image ||
                            "https://via.placeholder.com/80x80?text=No+Image"
                          }
                          alt={doctor.name}
                          className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-[#232b3e] mx-auto mb-2 md:mb-3 object-cover bg-gray-700"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://via.placeholder.com/80x80?text=No+Image";
                          }}
                        />
                        <h3
                          className="text-white text-base md:text-xl font-bold text-center truncate w-full"
                          title={doctor.name}
                        >
                          {doctor.name}
                        </h3>
                        <p
                          className="text-blue-400 text-center font-semibold truncate w-full text-sm md:text-base"
                          title={doctor.speciality}
                        >
                          {doctor.speciality}
                        </p>
                        <div className="flex items-center justify-center text-gray-400 text-xs md:text-sm mt-1">
                          <FaClock className="mr-1" /> {doctor.experience}
                        </div>
                        <p className="text-blue-300 text-center font-bold mt-2 text-sm md:text-base">
                          ₹{doctor.fees}
                        </p>
                        {selected && (
                          <div className="mt-2 md:mt-3 text-center">
                            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs md:text-base">
                              Selected
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Booking Form */}
              <form
                onSubmit={handleSubmit}
                className="bg-[#232b3e] border-none rounded-2xl shadow-2xl p-4 md:p-6 space-y-4 md:space-y-5"
              >
                {/* Date and Time pickers */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  <div className="relative col-span-2 w-full">
                    <div className="flex items-center">
                      <FaCalendarAlt className="mr-2 md:mr-3 text-blue-400 text-base md:text-lg z-10" />
                      <button
                        type="button"
                        className="mr-1 md:mr-2 p-2 rounded-full bg-blue-700 text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        onClick={() => scrollCarousel(dateCarouselRef, "left")}
                        aria-label="Scroll dates left"
                      >
                        &#8592;
                      </button>
                      <div
                        className="overflow-x-auto w-full hide-scrollbar"
                        ref={dateCarouselRef}
                      >
                        <div className="flex gap-1 md:gap-2 py-1 whitespace-nowrap">
                          {next7Days.map((day) => (
                            <button
                              key={day.value}
                              type="button"
                              className={`min-w-[100px] md:min-w-[140px] px-3 md:px-5 py-2 md:py-3 rounded-lg font-semibold text-xs md:text-base transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400
                                ${
                                  formData.date === day.value
                                    ? "bg-blue-600 text-white"
                                    : "bg-[#232b3e] text-blue-200 border border-blue-700 hover:bg-blue-700 hover:text-white"
                                }`}
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  date: day.value,
                                }))
                              }
                            >
                              {day.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <button
                        type="button"
                        className="ml-1 md:ml-2 p-2 rounded-full bg-blue-700 text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        onClick={() => scrollCarousel(dateCarouselRef, "right")}
                        aria-label="Scroll dates right"
                      >
                        &#8594;
                      </button>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <div className="flex items-center">
                    <FaClock className="mr-2 md:mr-3 text-blue-400 text-base md:text-lg z-10" />
                    <button
                      type="button"
                      className="mr-1 md:mr-2 p-2 rounded-full bg-blue-700 text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      onClick={() => scrollCarousel(timeCarouselRef, "left")}
                      aria-label="Scroll times left"
                    >
                      &#8592;
                    </button>
                    <div
                      className="overflow-x-auto w-full hide-scrollbar"
                      ref={timeCarouselRef}
                    >
                      <div className="flex gap-1 md:gap-2 py-1 whitespace-nowrap">
                        {timeSlots.map((slot, index) => (
                          <button
                            key={index}
                            type="button"
                            className={`min-w-[120px] md:min-w-[180px] px-3 md:px-5 py-2 md:py-3 rounded-lg font-semibold text-xs md:text-base transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400
                              ${
                                formData.timeslot === slot
                                  ? "bg-blue-600 text-white"
                                  : "bg-[#232b3e] text-blue-200 border border-blue-700 hover:bg-blue-700 hover:text-white"
                              }`}
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                timeslot: slot,
                              }))
                            }
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="ml-1 md:ml-2 p-2 rounded-full bg-blue-700 text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      onClick={() => scrollCarousel(timeCarouselRef, "right")}
                      aria-label="Scroll times right"
                    >
                      &#8594;
                    </button>
                  </div>
                </div>
                <textarea
                  name="message"
                  placeholder="Additional Notes (Optional)"
                  rows="3"
                  className="w-full px-3 md:px-4 py-2 md:py-2 text-sm md:text-base rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-[#232b3e] text-white shadow-sm resize-none border border-blue-700 placeholder-gray-400"
                  value={formData.message}
                  onChange={handleChange}
                ></textarea>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 md:gap-3 mt-1 md:mt-2">
                  {isLoggedIn ? (
                    <button
                      type="submit"
                      className="w-full sm:w-auto bg-gradient-to-r from-blue-700 to-indigo-700 text-white py-2 md:py-3 px-6 md:px-10 rounded-xl text-base md:text-lg font-bold shadow-lg hover:from-blue-800 hover:to-indigo-800 transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <span>Book Appointment</span>
                      <FaArrowRight />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => navigate("/login")}
                      className="w-full sm:w-auto bg-gradient-to-r from-blue-700 to-indigo-700 text-white py-2 md:py-3 px-6 md:px-10 rounded-xl text-base md:text-lg font-bold shadow-lg hover:from-blue-800 hover:to-indigo-800 transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <span>Login to Book</span>
                      <FaArrowRight />
                    </button>
                  )}
                  <div className="flex items-center justify-center sm:justify-end space-x-2 text-green-400 text-sm md:text-base font-semibold mt-2 sm:mt-0">
                    <FaCheckCircle />
                    <span>Secure & Confidential</span>
                  </div>
                </div>
              </form>
            </div>

            {/* Right: Doctor Details Panel */}
            <div className="lg:col-span-5 mt-4 lg:mt-0">
              {selectedDoctor ? (
                <div className="rounded-2xl p-4 md:p-8 bg-[#232b3e] shadow-2xl text-white min-h-[300px] md:min-h-[400px] flex flex-col items-center gap-3 md:gap-4">
                  <img
                    src={
                      selectedDoctor.image ||
                      "https://via.placeholder.com/120x120?text=No+Image"
                    }
                    alt={selectedDoctor.name}
                    className="w-20 h-20 md:w-28 md:h-28 rounded-full border-4 border-[#232b3e] mx-auto mb-2 md:mb-4 object-cover bg-gray-700"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/120x120?text=No+Image";
                    }}
                  />
                  <h2 className="text-xl md:text-2xl font-bold text-center">
                    {selectedDoctor.name}
                  </h2>
                  <p className="text-blue-400 text-center font-semibold text-sm md:text-base">
                    {selectedDoctor.speciality}
                  </p>
                  <div className="flex flex-col md:flex-row justify-center gap-2 md:gap-4 text-gray-300 mt-1 md:mt-2 text-xs md:text-base">
                    <span>
                      <FaEnvelope className="inline mr-1" />{" "}
                      {selectedDoctor.email}
                    </span>
                    <span>
                      <FaPhone className="inline mr-1" />{" "}
                      {selectedDoctor.phone || "N/A"}
                    </span>
                  </div>
                  <div className="w-full mt-2 md:mt-4">
                    <h3 className="font-bold text-sm md:text-base">
                      Biography
                    </h3>
                    <p className="text-gray-300 text-xs md:text-base">
                      {selectedDoctor.about || "No biography available."}
                    </p>
                  </div>
                  <div className="w-full mt-1 md:mt-2">
                    <h3 className="font-bold text-sm md:text-base">Location</h3>
                    <p className="text-gray-300 text-xs md:text-base">
                      {selectedDoctor.address &&
                      (selectedDoctor.address.street ||
                        selectedDoctor.address.city)
                        ? [
                            selectedDoctor.address.street,
                            selectedDoctor.address.city,
                          ]
                            .filter(Boolean)
                            .join(", ")
                        : "Not specified"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl p-4 md:p-8 bg-[#232b3e] shadow-2xl text-gray-400 flex flex-col items-center justify-center h-full min-h-[200px] md:min-h-[400px]">
                  <FaUser className="text-4xl md:text-6xl mb-2 md:mb-4" />
                  <p className="text-base md:text-lg font-semibold">
                    Select a doctor to see details
                  </p>
                </div>
              )}
            </div>
          </div>
        </animated.div>
      </animated.div>
    </>
  );
};

export default BookAppointment;
