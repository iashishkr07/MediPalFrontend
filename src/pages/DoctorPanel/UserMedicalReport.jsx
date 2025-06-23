import React, { useEffect, useState } from "react";
import doctorApi from "../../doctorApi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { FaFilePdf, FaUserCircle, FaNotesMedical } from "react-icons/fa";
import { MdOutlineMedicalServices } from "react-icons/md";
import { motion } from "framer-motion";

const UserMedicalReport = () => {
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [searchedAadhar, setSearchedAadhar] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [currentRecordIndex, setCurrentRecordIndex] = useState(0);
  const [currentReportIndex, setCurrentReportIndex] = useState(0);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError("");
      try {
        const bookingsRes = await doctorApi.get("/doctor/bookings");
        const bookings = bookingsRes?.data?.bookings || [];

        const aadharNos = [
          ...new Set(bookings.map((b) => b.aadharNo).filter(Boolean)),
        ];

        const results = await Promise.all(
          aadharNos.map(async (aadharNo) => {
            try {
              const [recordsRes, reportsRes] = await Promise.all([
                fetch(
                  `http://localhost:7000/api/medical-records/all/${aadharNo}`
                ).then((res) => res.json()),
                fetch(`http://localhost:7000/api/all-reports/${aadharNo}`).then(
                  (res) => res.json()
                ),
              ]);
              return {
                aadharNo,
                records: recordsRes.data || [],
                reports: reportsRes.data || [],
              };
            } catch {
              return { aadharNo, records: [], reports: [], error: true };
            }
          })
        );

        setAllData(results);
      } catch {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    setLoading(true);
    setError("");
    setSearchResult(null);
    setSearchedAadhar(search.trim());
    try {
      const [recordsRes, reportsRes] = await Promise.all([
        fetch(
          `http://localhost:7000/api/medical-records/all/${search.trim()}`
        ).then((res) => res.json()),
        fetch(`http://localhost:7000/api/all-reports/${search.trim()}`).then(
          (res) => res.json()
        ),
      ]);
      setSearchResult({
        aadharNo: search.trim(),
        records: recordsRes.data || [],
        reports: reportsRes.data || [],
        error: recordsRes.error || reportsRes.error,
      });
    } catch {
      setError("Failed to fetch data for this Aadhar number");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen rounded-3xl shadow-2xl bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <h2 className="text-4xl font-extrabold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-500 to-pink-500 pb-4 flex items-center gap-3 border-b-4 border-gradient-to-r from-blue-400 via-purple-300 to-pink-300">
        <MdOutlineMedicalServices className="text-blue-400 text-4xl drop-shadow-lg" />
        <span>User Medical Data Carousel</span>
      </h2>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex items-center gap-3 mb-8">
        <input
          type="text"
          placeholder="Enter Aadhar Number..."
          className="w-full md:w-96 px-4 py-2 rounded-xl border-2 border-blue-300 focus:outline-none focus:ring-2 focus:ring-purple-400 text-lg shadow bg-white/60 backdrop-blur-md placeholder:text-blue-400 font-medium"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          type="submit"
          className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-400 text-white font-bold shadow-lg hover:scale-105 hover:from-blue-600 hover:to-pink-500 transition-all duration-200 border-none"
        >
          Search
        </button>
      </form>

      {/* Loading/Error States */}
      {loading && (
        <div className="text-blue-600 text-lg animate-pulse font-semibold">
          Loading data...
        </div>
      )}
      {error && <div className="text-pink-500 font-semibold">{error}</div>}

      {/* Show search result if searched */}
      {searchedAadhar && !loading && !error && searchResult && (
        <>
          {searchResult.records.length === 0 &&
          searchResult.reports.length === 0 ? (
            <div className="text-gray-400 italic text-center">
              No data found for this Aadhar number.
            </div>
          ) : (
            <div
              key={searchResult.aadharNo}
              className="mb-16 border-2 border-transparent bg-white/60 backdrop-blur-xl rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-shadow duration-300 border-gradient-to-r from-blue-200 via-purple-200 to-pink-200"
            >
              {/* Profile Card Header */}
              <motion.div
                key={searchResult.aadharNo}
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.4 }}
                className="max-w-2xl mx-auto -mt-8 mb-10 z-20 relative"
              >
                <div className="flex flex-col md:flex-row items-center gap-6 bg-white/70 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-blue-100">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <FaUserCircle className="text-blue-400 text-6xl mb-2 md:mb-0" />
                  </motion.div>
                  <div className="flex-1">
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.15 }}
                      className="text-2xl font-bold text-blue-700 mb-1"
                    >
                      Aadhar No: {searchResult.aadharNo}
                    </motion.div>
                    {searchResult.records[0] && (
                      <>
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.2 }}
                          className="text-lg font-semibold text-purple-700 mb-1"
                        >
                          {searchResult.records[0].name}
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.25 }}
                          className="text-gray-500 mb-1"
                        >
                          Age: {searchResult.records[0].age} | Gender:{" "}
                          {searchResult.records[0].gender}
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.3 }}
                          className="text-gray-400 text-sm"
                        >
                          Last Updated:{" "}
                          {searchResult.records[0].updatedAt
                            ? new Date(
                                searchResult.records[0].updatedAt
                              ).toLocaleString()
                            : "N/A"}
                        </motion.div>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
              {/* Main Content: Medical Records Timeline & Reports Gallery */}
              <div className="flex flex-col md:flex-row gap-8">
                {/* Left - Medical Records Timeline (or carousel) */}
                <div className="w-full md:w-1/2 bg-white/70 backdrop-blur-lg rounded-2xl p-4 shadow-xl relative border border-blue-100">
                  <h4 className="text-lg font-semibold text-blue-700 mb-4 flex items-center gap-2">
                    <FaNotesMedical className="text-purple-400" />
                    <span>Medical Records Timeline</span>
                  </h4>
                  {searchResult.records.length ? (
                    <div className="relative pl-8">
                      {/* Timeline vertical line (optional, for style) */}
                      <div className="absolute left-3 top-8 bottom-4 w-1 bg-gradient-to-b from-blue-300 via-purple-300 to-pink-300 rounded-full z-0"></div>
                      {/* Only show the current record */}
                      {(() => {
                        const rec = searchResult.records[currentRecordIndex];
                        return (
                          <div
                            key={rec._id || currentRecordIndex}
                            className="relative mb-10 group"
                          >
                            {/* Timeline icon */}
                            <div className="absolute -left-6 top-6 z-10">
                              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 shadow-lg border-4 border-white">
                                <FaNotesMedical className="text-white text-xl" />
                              </div>
                            </div>
                            {/* Timeline card */}
                            <motion.div
                              key={currentRecordIndex}
                              initial={{ opacity: 0, x: 40 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -40 }}
                              transition={{ duration: 0.3 }}
                              className="ml-6 p-6 border border-blue-100 rounded-2xl shadow bg-white/80 transition-colors duration-200 animate-fadein backdrop-blur-md"
                            >
                              <div className="text-xs text-gray-500 mb-2 flex items-center gap-2">
                                <span className="inline-block w-2 h-2 rounded-full bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400"></span>
                                {rec.createdAt
                                  ? new Date(rec.createdAt).toLocaleString()
                                  : "N/A"}
                              </div>
                              <ul className="text-sm text-gray-700 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
                                {/* Basic fields, two columns */}
                                <motion.li
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.3, delay: 0.05 }}
                                >
                                  <strong>Record ID:</strong>{" "}
                                  {rec.recordId || "N/A"}
                                </motion.li>
                                <motion.li
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.3, delay: 0.1 }}
                                >
                                  <strong>Weight:</strong> {rec.weight || "N/A"}
                                </motion.li>
                                <motion.li
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.3, delay: 0.15 }}
                                >
                                  <strong>Height:</strong> {rec.height || "N/A"}
                                </motion.li>
                                <motion.li
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.3, delay: 0.2 }}
                                >
                                  <strong>BMI:</strong> {rec.bmi || "N/A"}
                                </motion.li>
                                <motion.li
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.3, delay: 0.25 }}
                                >
                                  <strong>Blood Pressure:</strong>{" "}
                                  {rec.bloodPressure || "N/A"}
                                </motion.li>
                                <motion.li
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.3, delay: 0.3 }}
                                >
                                  <strong>Sugar Level:</strong>{" "}
                                  {rec.sugarLevel || "N/A"}
                                </motion.li>
                                <motion.li
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.3, delay: 0.35 }}
                                >
                                  <strong>Cholesterol:</strong>{" "}
                                  {rec.cholesterol || "N/A"}
                                </motion.li>
                                <motion.li
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.3, delay: 0.4 }}
                                >
                                  <strong>Allergies:</strong>{" "}
                                  {rec.allergies || "None"}
                                </motion.li>
                                <motion.li
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.3, delay: 0.45 }}
                                >
                                  <strong>Past Surgeries:</strong>{" "}
                                  {rec.pastSurgeries || "None"}
                                </motion.li>
                                <motion.li
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.3, delay: 0.5 }}
                                >
                                  <strong>Current Medications:</strong>{" "}
                                  {rec.currentMedications || "None"}
                                </motion.li>
                                <motion.li
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.3, delay: 0.55 }}
                                >
                                  <strong>Family History:</strong>{" "}
                                  {rec.familyHistory || "None"}
                                </motion.li>
                                <motion.li
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.3, delay: 0.6 }}
                                >
                                  <strong>Vaccination History:</strong>{" "}
                                  {rec.vaccinationHistory || "None"}
                                </motion.li>
                                <motion.li
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.3, delay: 0.65 }}
                                >
                                  <strong>Dietary Restrictions:</strong>{" "}
                                  {rec.dietaryRestrictions || "None"}
                                </motion.li>

                                {/* Emergency Contact (left col) */}
                                <motion.li
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.3, delay: 0.7 }}
                                  className="mt-4 font-semibold text-blue-800 col-span-1"
                                >
                                  Emergency Contact:
                                </motion.li>
                                <motion.li
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.3, delay: 0.75 }}
                                  className="mt-4 font-semibold text-blue-800 col-span-1"
                                >
                                  Mental Health:
                                </motion.li>
                                <motion.li
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.3, delay: 0.8 }}
                                  className="ml-2 col-span-1"
                                >
                                  <strong>Name:</strong>{" "}
                                  {rec.emergencyContact?.name || "N/A"}
                                  <br />
                                  <strong>Relationship:</strong>{" "}
                                  {rec.emergencyContact?.relationship || "N/A"}
                                  <br />
                                  <strong>Phone:</strong>{" "}
                                  {rec.emergencyContact?.phone || "N/A"}
                                </motion.li>
                                <motion.li
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.3, delay: 0.85 }}
                                  className="ml-2 col-span-1"
                                >
                                  <strong>Stress Level:</strong>{" "}
                                  {rec.mentalHealth?.stressLevel || "N/A"}
                                  <br />
                                  <strong>Anxiety:</strong>{" "}
                                  {rec.mentalHealth?.anxiety ? "Yes" : "No"}
                                  <br />
                                  <strong>Depression:</strong>{" "}
                                  {rec.mentalHealth?.depression ? "Yes" : "No"}
                                </motion.li>

                                {/* Sleep Quality (left col) */}
                                <motion.li
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.3, delay: 0.9 }}
                                  className="mt-4 font-semibold text-blue-800 col-span-1"
                                >
                                  Sleep Quality:
                                </motion.li>
                                <motion.li
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.3, delay: 0.95 }}
                                  className="mt-4 font-semibold text-blue-800 col-span-1"
                                >
                                  Lifestyle:
                                </motion.li>
                                <motion.li
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.3, delay: 1 }}
                                  className="ml-2 col-span-1"
                                >
                                  <strong>Hours Per Night:</strong>{" "}
                                  {rec.sleepQuality?.hoursPerNight || "N/A"}
                                  <br />
                                  <strong>Quality:</strong>{" "}
                                  {rec.sleepQuality?.quality || "N/A"}
                                </motion.li>
                                <motion.li
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.3, delay: 1.05 }}
                                  className="ml-2 col-span-1"
                                >
                                  <strong>Smoking:</strong>{" "}
                                  {rec.lifestyle?.smoking ? "Yes" : "No"}
                                  <br />
                                  <strong>Alcohol:</strong>{" "}
                                  {rec.lifestyle?.alcohol ? "Yes" : "No"}
                                  <br />
                                  <strong>Exercise:</strong>{" "}
                                  {rec.lifestyle?.exercise ? "Yes" : "No"}
                                  <br />
                                  <strong>Sleep:</strong>{" "}
                                  {rec.lifestyle?.sleep ? "Yes" : "No"}
                                </motion.li>
                              </ul>
                            </motion.div>
                          </div>
                        );
                      })()}
                      {/* Navigation Buttons */}
                      <div className="flex justify-between mt-4">
                        <button
                          className="px-4 py-2 rounded-lg bg-blue-200 text-blue-800 font-semibold shadow hover:bg-blue-300 disabled:opacity-50"
                          onClick={() =>
                            setCurrentRecordIndex((i) => Math.max(i - 1, 0))
                          }
                          disabled={currentRecordIndex === 0}
                        >
                          Back
                        </button>
                        <span className="text-gray-500 text-sm">
                          {currentRecordIndex + 1} of{" "}
                          {searchResult.records.length}
                        </span>
                        <button
                          className="px-4 py-2 rounded-lg bg-blue-200 text-blue-800 font-semibold shadow hover:bg-blue-300 disabled:opacity-50"
                          onClick={() =>
                            setCurrentRecordIndex((i) =>
                              Math.min(i + 1, searchResult.records.length - 1)
                            )
                          }
                          disabled={
                            currentRecordIndex ===
                            searchResult.records.length - 1
                          }
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-400 italic">
                      No medical records found.
                    </div>
                  )}
                </div>

                {/* Right - Uploaded Reports Carousel */}
                <div className="w-full md:w-1/2 bg-white/70 backdrop-blur-lg rounded-2xl p-4 shadow-xl relative border border-pink-100">
                  <h4 className="text-lg font-semibold text-pink-700 mb-4 flex items-center gap-2">
                    <FaFilePdf className="text-pink-400" />
                    <span>Uploaded Reports</span>
                  </h4>
                  {searchResult.reports.length ? (
                    <>
                      {/* Only show the current report */}
                      {(() => {
                        const report = searchResult.reports[currentReportIndex];
                        return (
                          <motion.div
                            key={currentReportIndex}
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -40 }}
                            transition={{ duration: 0.3 }}
                            className="p-6 border border-emerald-100 rounded-xl shadow bg-white animate-fadein"
                          >
                            <div className="font-semibold text-emerald-700 mb-2 text-lg">
                              {report.reportType} - Dr. {report.doctorName}
                            </div>
                            <div className="text-sm text-gray-500 mb-2">
                              📅{" "}
                              {new Date(report.reportDate).toLocaleDateString()}
                            </div>
                            <div className="text-sm mb-2">
                              <strong>Notes:</strong> {report.notes || "N/A"}
                            </div>
                            <div className="grid grid-cols-1 gap-3">
                              {report.files.map((file, idx) => {
                                const isImage =
                                  /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(
                                    file.filename
                                  );
                                const isPdf = /\.pdf$/i.test(file.filename);
                                return isImage ? (
                                  <motion.img
                                    key={file._id || idx}
                                    src={`http://localhost:7000/${file.path}`}
                                    alt={file.filename}
                                    className="w-full max-h-64 object-contain border rounded-lg shadow hover:scale-105 transition-transform duration-200 bg-white"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{
                                      duration: 0.3,
                                      delay: idx * 0.05,
                                    }}
                                  />
                                ) : isPdf ? (
                                  <motion.a
                                    key={file._id || idx}
                                    href={`http://localhost:7000/${file.path}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 p-3 border rounded-lg bg-red-50 hover:bg-red-100 transition-colors duration-200 shadow"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{
                                      duration: 0.3,
                                      delay: idx * 0.05,
                                    }}
                                  >
                                    <FaFilePdf className="text-red-500 text-2xl" />
                                    <span className="truncate">
                                      {file.filename}
                                    </span>
                                  </motion.a>
                                ) : (
                                  <motion.span
                                    key={file._id || idx}
                                    className="text-gray-400 italic"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{
                                      duration: 0.3,
                                      delay: idx * 0.05,
                                    }}
                                  >
                                    Unknown file type
                                  </motion.span>
                                );
                              })}
                            </div>
                          </motion.div>
                        );
                      })()}
                      {/* Navigation Buttons */}
                      <div className="flex justify-between mt-4">
                        <button
                          className="px-4 py-2 rounded-lg bg-pink-200 text-pink-800 font-semibold shadow hover:bg-pink-300 disabled:opacity-50"
                          onClick={() =>
                            setCurrentReportIndex((i) => Math.max(i - 1, 0))
                          }
                          disabled={currentReportIndex === 0}
                        >
                          Back
                        </button>
                        <span className="text-gray-500 text-sm">
                          {currentReportIndex + 1} of{" "}
                          {searchResult.reports.length}
                        </span>
                        <button
                          className="px-4 py-2 rounded-lg bg-pink-200 text-pink-800 font-semibold shadow hover:bg-pink-300 disabled:opacity-50"
                          onClick={() =>
                            setCurrentReportIndex((i) =>
                              Math.min(i + 1, searchResult.reports.length - 1)
                            )
                          }
                          disabled={
                            currentReportIndex ===
                            searchResult.reports.length - 1
                          }
                        >
                          Next
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="text-gray-400 italic">
                      No reports uploaded.
                    </div>
                  )}
                  {/* Thumbnails/Initials row for reports */}
                  {searchResult.reports.length > 1 && (
                    <div className="flex gap-2 mt-4 justify-center">
                      {searchResult.reports.map((report, i) => {
                        const isImage =
                          report.files[0] &&
                          /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(
                            report.files[0].filename
                          );
                        return isImage ? (
                          <motion.img
                            key={report._id || i}
                            src={`http://localhost:7000/${report.files[0].path}`}
                            alt={report.files[0].filename}
                            className="w-10 h-10 object-cover rounded-full border-2 border-pink-300 shadow"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: i * 0.05 }}
                          />
                        ) : (
                          <motion.div
                            key={report._id || i}
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-pink-200 text-pink-700 font-bold border-2 border-pink-300 shadow"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: i * 0.05 }}
                          >
                            {report.reportType?.[0] || "?"}
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* If no search, show nothing or a prompt */}
      {!searchedAadhar && (
        <div className="text-gray-400 italic text-center mt-16">
          Enter an Aadhar number to view user medical data.
        </div>
      )}
    </div>
  );
};

export default UserMedicalReport;
