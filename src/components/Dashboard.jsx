import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from "recharts";
import { Alert, Button, Spin, message } from "antd";
import { FileTextOutlined } from "@ant-design/icons";
import axios from "axios";
import { motion } from "framer-motion";
import AnimatedBackground from "./AnimatedBackground";

const API_BASE_URL = "https://medipalbackend.onrender.com";

const calculateHealthScore = (record) => {
  let score = 0;

  // BMI
  const bmi = parseFloat(record.bmi);
  if (bmi >= 18.5 && bmi <= 24.9) score += 10;

  // Blood Pressure
  if (record.bloodPressure) {
    const [sys, dia] = record.bloodPressure.split("/").map(Number);
    if (sys >= 90 && sys <= 120 && dia >= 60 && dia <= 80) score += 10;
  }

  // Sugar Level
  const sugar = parseFloat(record.sugarLevel);
  if (sugar >= 70 && sugar <= 140) score += 10;

  // Heart Rate
  const hr = parseFloat(record.heartRate);
  if (hr >= 60 && hr <= 100) score += 10;

  // Respiratory Rate
  const rr = parseFloat(record.respiratoryRate);
  if (rr >= 12 && rr <= 20) score += 10;

  // Cholesterol
  const chol = parseFloat(record.cholesterol);
  if (chol > 0 && chol <= 200) score += 10;

  // Sleep Quality
  const sleepHours = parseFloat(record.sleepQuality?.hoursPerNight);
  const quality = record.sleepQuality?.quality?.toLowerCase();
  if (sleepHours >= 7 && ["good", "excellent"].includes(quality)) score += 10;

  // Lifestyle
  const { smoking, alcohol, exercise } = record.lifestyle || {};
  if (!smoking && !alcohol && exercise) score += 10;

  // Mental Health
  const mental = record.mentalHealth || {};
  if (
    (mental.stressLevel === "low" || mental.stressLevel === "none") &&
    !mental.anxiety &&
    !mental.depression
  )
    score += 10;

  // Temperature
  const temp = parseFloat(record.temperature);
  if (temp >= 97 && temp <= 99) score += 10;

  return score; // out of 100
};

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [latestRecord, setLatestRecord] = useState(null);
  const [allRecords, setAllRecords] = useState([]);
  const [aadharNo, setAadharNo] = useState(null);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please login to access your medical records");
          setLoading(false);
          return;
        }

        const userResponse = await axios.get(`${API_BASE_URL}/api/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (userResponse.data.success && userResponse.data.user) {
          const userAadharNo = userResponse.data.user.AadharNo;
          const userEmail = userResponse.data.user.Email;
          setAadharNo(userAadharNo);

          const recordResponse = await axios.get(
            `${API_BASE_URL}/api/medical-records/latest/${userAadharNo}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (recordResponse.data.success && recordResponse.data.data) {
            setLatestRecord(recordResponse.data.data);
          } else {
            setError("No medical records found");
          }

          const allRecordsResponse = await axios.get(
            `${API_BASE_URL}/api/medical-records/${userAadharNo}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (
            allRecordsResponse.data.success &&
            Array.isArray(allRecordsResponse.data.data)
          ) {
            setAllRecords(allRecordsResponse.data.data);
          }

          if (userEmail) {
            try {
              const bookingsResponse = await axios.get(
                `${API_BASE_URL}/api/bookings/${userEmail}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              if (Array.isArray(bookingsResponse.data)) {
                setBookings(bookingsResponse.data);
              }
            } catch (bookingError) {
              console.error("Failed to fetch bookings", bookingError);
              // Optionally, you can set an error state for bookings
            }
          }
        } else {
          setError("Failed to fetch user data");
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to fetch data. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleDownloadPDF = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !aadharNo) {
        message.error("Please login to download medical history");
        return;
      }

      message.loading({ content: "Generating PDF...", key: "pdfLoading" });

      const response = await axios.get(
        `${API_BASE_URL}/api/medical-records/${aadharNo}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      message.success({
        content: "PDF generated successfully!",
        key: "pdfLoading",
        duration: 2,
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "medical-history.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      message.error({
        content: "Failed to download medical history. Please try again later.",
        key: "pdfLoading",
        duration: 3,
      });
      console.error("Error downloading PDF:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-900">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 min-h-screen bg-slate-900">
        <Alert message={error} type="error" showIcon />
      </div>
    );
  }

  if (!latestRecord) {
    return (
      <div className="p-8 min-h-screen bg-slate-900">
        <Alert message="No medical records found" type="info" showIcon />
      </div>
    );
  }

  // Calculate health score from latestRecord
  const healthScore = latestRecord ? calculateHealthScore(latestRecord) : 0;

  const medProgramData = [
    { name: "medProgram", value: healthScore, fill: "#e879f9" },
  ];

  const chartData = [
    { name: "Weight", value: Number(latestRecord.weight), unit: "kg" },
    { name: "Height", value: Number(latestRecord.height), unit: "cm" },
    { name: "BMI", value: Number(latestRecord.bmi) },
    { name: "Sugar Level", value: Number(latestRecord.sugarLevel) },
  ];

  const vitals = [
    { title: "Weight", value: `${latestRecord.weight} kg` },
    { title: "Height", value: `${latestRecord.height} cm` },
    {
      title: "Blood Pressure",
      value: latestRecord.bloodPressure || "N/A",
      highlight: true,
    },
    { title: "BMI", value: Number(latestRecord.bmi).toFixed(2) },
    { title: "Sugar Level", value: latestRecord.sugarLevel || "N/A" },
  ];

  const cardClass = "bg-gray-800";

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
      className="relative p-4 sm:p-6 md:p-8 min-h-screen transition-colors duration-300 text-gray-200"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <AnimatedBackground />
      <motion.header
        className="flex justify-between items-center mb-8"
        variants={itemVariants}
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
          Dashboard
        </h1>
      </motion.header>

      <motion.div
        className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-8"
        variants={containerVariants}
      >
        <motion.div
          className={`${cardClass} rounded-xl p-4 shadow-md flex items-center justify-center`}
          variants={itemVariants}
        >
          <div className="w-48 h-48 sm:w-56 sm:h-56 relative">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="70%"
                outerRadius="85%"
                data={medProgramData}
                startAngle={90}
                endAngle={-270}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar
                  background={{ fill: "rgba(255, 255, 255, 0.1)" }}
                  dataKey="value"
                  cornerRadius={10}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span
                className="text-4xl sm:text-5xl font-bold"
                style={{ color: "#e879f9" }}
              >
                {healthScore}%
              </span>
              <span className="text-sm sm:text-base text-gray-400 mt-2">
                Health <br />
                Score
              </span>
            </div>
          </div>
        </motion.div>
        <motion.div
          className={`${cardClass} rounded-xl p-6 shadow-md flex flex-col`}
          variants={itemVariants}
        >
          <div className="flex-grow flex flex-col items-start sm:items-end">
            <p className="text-gray-400 text-lg">Completed Health practises</p>
            <p
              className="text-5xl sm:text-6xl font-bold mt-2"
              style={{ color: "#e879f9" }}
            >
              {healthScore}
              <span className="text-3xl sm:text-4xl text-gray-400">/100</span>
            </p>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1.5 mt-auto">
            <div
              className="h-1.5 rounded-full"
              style={{ width: "83%", backgroundColor: "#e879f9" }}
            ></div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 xl:grid-cols-5 gap-8"
        variants={containerVariants}
      >
        <motion.div className="xl:col-span-3 space-y-8">
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4"
            variants={containerVariants}
          >
            {vitals.map((vital) => (
              <motion.div
                key={vital.title}
                className={`${cardClass} rounded-xl p-4 flex flex-col justify-between shadow-md`}
                variants={itemVariants}
              >
                <h3
                  className={`text-sm font-semibold ${
                    vital.highlight ? "text-green-400" : "text-gray-400"
                  }`}
                >
                  {vital.title}
                </h3>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold mt-2">
                  {vital.value}
                </p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className={`${cardClass} rounded-xl p-4 sm:p-6 shadow-md`}
            variants={itemVariants}
          >
            <h2 className="text-xl font-bold mb-4">Your Bookings</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-400">
                    <th className="p-2">Doctor</th>
                    <th className="p-2">Date</th>
                    <th className="p-2">Time</th>
                    <th className="p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.length > 0 ? (
                    bookings.map((booking) => (
                      <tr key={booking._id}>
                        <td className="p-2">{booking.doctor}</td>
                        <td className="p-2">
                          {new Date(booking.date).toLocaleDateString()}
                        </td>
                        <td className="p-2">{booking.timeslot}</td>
                        <td className="p-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              booking.status === "confirmed"
                                ? "bg-green-500 text-white"
                                : booking.status === "pending"
                                ? "bg-yellow-500 text-black"
                                : booking.status === "completed"
                                ? "bg-blue-500 text-white"
                                : booking.status === "cancelled"
                                ? "bg-red-500 text-white"
                                : ""
                            }`}
                          >
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="p-4 text-center text-gray-400">
                        No bookings found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="xl:col-span-2 space-y-8"
          variants={containerVariants}
        >
          <motion.div
            className={`${cardClass} rounded-xl p-6 shadow-md`}
            variants={itemVariants}
          >
            <h3 className="text-lg font-semibold text-gray-300">
              Aadhar Number
            </h3>
            <p className="text-2xl font-bold text-green-400 mt-2">{aadharNo}</p>
            <div className="mt-6">
              <Button
                type="primary"
                icon={<FileTextOutlined />}
                onClick={handleDownloadPDF}
                className="w-full"
              >
                Download Medical History (PDF)
              </Button>
            </div>
          </motion.div>
          <motion.div
            className={`${cardClass} rounded-xl p-4 sm:p-6 shadow-md`}
            variants={itemVariants}
          >
            <h2 className="text-xl font-bold mb-4">Health Metrics Overview</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255, 255, 255, 0.1)"
                />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  cursor={{ fill: "rgba(100, 116, 139, 0.1)" }}
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    borderRadius: "0.5rem",
                  }}
                  labelStyle={{ color: "#f1f5f9" }}
                />

                <Bar dataKey="value" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
