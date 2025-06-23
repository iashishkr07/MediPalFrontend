import React, { useState, useRef } from "react";
import Tesseract from "tesseract.js";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaFilePdf,
  FaUserCircle,
  FaNotesMedical,
  FaCheckCircle,
  FaUpload,
} from "react-icons/fa";
import { MdOutlineMedicalServices } from "react-icons/md";
import { useNavigate } from "react-router-dom";

// Animation variants
const buttonVariants = {
  rest: { scale: 1, boxShadow: "0px 2px 8px rgba(0,0,0,0.08)" },
  hover: { scale: 1.06, boxShadow: "0px 4px 16px rgba(0,0,0,0.16)" },
  tap: { scale: 0.97 },
};
const cardVariants = {
  rest: { scale: 1, boxShadow: "0px 2px 16px rgba(0,0,0,0.10)" },
  hover: { scale: 1.02, boxShadow: "0px 8px 32px rgba(0,0,0,0.18)" },
};
const imageVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.05, boxShadow: "0px 4px 24px rgba(0,0,0,0.12)" },
};

const steps = [
  { label: "Upload Aadhar", icon: <FaUpload className="text-xl" /> },
  {
    label: "Extract & Fetch",
    icon: <MdOutlineMedicalServices className="text-xl" />,
  },
  { label: "View Results", icon: <FaCheckCircle className="text-xl" /> },
];

const AnalyzeReport = () => {
  const [aadharImage, setAadharImage] = useState(null);
  const [aadharPreview, setAadharPreview] = useState(null);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [aadharNo, setAadharNo] = useState("");
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentRecordIndex, setCurrentRecordIndex] = useState(0);
  const [currentReportIndex, setCurrentReportIndex] = useState(0);
  const fileInputRef = useRef();
  const [isDragActive, setIsDragActive] = useState(false);
  const navigate = useNavigate();

  // Stepper logic
  let step = 0;
  if (aadharImage && !aadharNo) step = 1;
  if (aadharNo && data) step = 2;

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAadharImage(file);
      setAadharPreview(URL.createObjectURL(file));
      setAadharNo("");
      setData(null);
      setError(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => setIsDragActive(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setAadharImage(file);
      setAadharPreview(URL.createObjectURL(file));
      setAadharNo("");
      setData(null);
      setError(null);
    }
  };

  // OCR and extract Aadhar number
  const handleExtractAadhar = async () => {
    if (!aadharImage) return;
    setOcrLoading(true);
    setOcrProgress(0);
    setError(null);
    setAadharNo("");
    setData(null);
    try {
      const { data } = await Tesseract.recognize(aadharImage, "eng", {
        logger: (m) => {
          if (m.status === "recognizing text") {
            setOcrProgress(Math.round(m.progress * 100));
          }
        },
      });
      const text = data.text;
      // Extract Aadhar number
      const match = text.match(/\b\d{4}\s\d{4}\s\d{4}\b/);
      if (match) {
        const extracted = match[0].replace(/\s/g, "");
        setAadharNo(extracted);
        fetchMedicalData(extracted);
      } else {
        setError(
          "Could not detect Aadhar number. Please re-upload a clearer image."
        );
      }
    } catch (err) {
      setError("Failed to extract Aadhar number.");
    } finally {
      setOcrLoading(false);
      setOcrProgress(0);
    }
  };

  // Fetch medical records and reports
  const fetchMedicalData = async (aadhar) => {
    setLoading(true);
    setError(null);
    setData(null);
    setCurrentRecordIndex(0);
    setCurrentReportIndex(0);
    try {
      const [recordsRes, reportsRes] = await Promise.all([
        fetch(`https://medipalbackend.onrender.com/api/medical-records/all/${aadhar}`).then(
          (res) => res.json()
        ),
        fetch(`https://medipalbackend.onrender.com/api/all-reports/${aadhar}`).then((res) =>
          res.json()
        ),
      ]);
      setData({
        aadharNo: aadhar,
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

  // Reset all
  const handleChoosePhoto = () => {
    setAadharImage(null);
    setAadharPreview(null);
    setAadharNo("");
    setData(null);
    setError(null);
    setOcrLoading(false);
    setOcrProgress(0);
    fileInputRef.current.value = null;
  };

  // Stepper component
  const Stepper = () => (
    <div className="flex items-center justify-center gap-4 mb-8">
      {steps.map((s, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className={`rounded-full w-10 h-10 flex items-center justify-center text-white font-bold text-lg transition-all duration-300 ${
              step === i
                ? "bg-blue-600 scale-110 shadow-lg"
                : step > i
                ? "bg-green-400"
                : "bg-gray-300"
            }`}
          >
            {s.icon}
          </div>
          <span
            className={`text-sm font-semibold transition-colors duration-300 ${
              step === i
                ? "text-blue-700"
                : step > i
                ? "text-green-600"
                : "text-gray-400"
            }`}
          >
            {s.label}
          </span>
          {i < steps.length - 1 && (
            <div className="w-8 h-1 bg-gradient-to-r from-blue-400 to-green-300 rounded-full mx-1" />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-2 py-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="w-full max-w-2xl mx-auto">
        <button
          onClick={() => navigate("/")}
          className="mb-8 px-5 py-2 rounded-lg bg-blue-700 hover:bg-blue-900 text-gray-100 font-bold shadow transition-colors duration-200"
        >
          ← Back to Home
        </button>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, type: "spring" }}
          className="bg-gray-900/90 backdrop-blur-2xl border border-blue-900 shadow-2xl rounded-3xl p-8 flex flex-col items-center w-full transition-shadow duration-300"
        >
          <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-300 drop-shadow-lg text-center mb-2">
            Aadhar-Based Medical Report Fetcher
          </h1>
          <p className="text-gray-400 text-center mb-6 max-w-lg">
            Upload your Aadhar card image to instantly fetch all your medical
            records and reports securely. Powered by OCR and smart data
            extraction.
          </p>
          <Stepper />
          {/* Upload Card */}
          <AnimatePresence>
            {!aadharImage && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="w-full flex flex-col items-center"
              >
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center w-full"
                >
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`w-44 h-44 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-300 relative group mb-4 ${
                      isDragActive
                        ? "border-cyan-400 bg-cyan-900/30"
                        : "border-blue-700 bg-blue-900/40"
                    }`}
                  >
                    <motion.div
                      animate={{ scale: isDragActive ? 1.08 : 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="flex flex-col items-center justify-center h-full w-full"
                    >
                      <span className="text-6xl mb-2">🪪</span>
                      <span className="text-blue-300 text-center text-base font-medium">
                        {isDragActive
                          ? "Drop file here!"
                          : "Click or drag Aadhar image"}
                      </span>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isDragActive ? 0.2 : 0 }}
                      className="absolute inset-0 bg-cyan-900 rounded-2xl pointer-events-none"
                    />
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    ref={fileInputRef}
                    className="hidden"
                  />
                  <span className="text-blue-300 text-lg font-semibold mb-2">
                    Upload Aadhar Card
                  </span>
                </label>
                {error && (
                  <div className="text-red-400 mt-3 text-sm text-center font-semibold">
                    {error}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          {/* Preview and Extract Card */}
          <AnimatePresence>
            {aadharImage && !aadharNo && (
              <motion.div
                key="preview"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="w-full flex flex-col items-center"
              >
                <motion.img
                  src={aadharPreview}
                  alt="Aadhar Preview"
                  className="rounded-xl w-52 h-40 object-cover border-2 border-blue-400 shadow-lg mb-6"
                  variants={imageVariants}
                  whileHover="hover"
                />
                <motion.button
                  variants={buttonVariants}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                  onClick={handleExtractAadhar}
                  disabled={ocrLoading}
                  className="bg-gradient-to-r from-green-700 to-cyan-700 hover:from-green-600 hover:to-cyan-800 text-gray-100 font-bold py-2 px-8 rounded-lg shadow-lg transition-colors text-lg disabled:bg-green-900 mb-2"
                >
                  {ocrLoading
                    ? `Extracting... ${ocrProgress}%`
                    : "Extract Aadhar Number & Fetch Reports"}
                </motion.button>
                <button
                  onClick={handleChoosePhoto}
                  className="mt-2 bg-blue-700 hover:bg-blue-900 text-gray-100 font-bold py-2 px-8 rounded-lg shadow-lg transition-colors text-base"
                >
                  Choose Different Photo
                </button>
                {error && (
                  <div className="text-red-400 mt-3 text-sm text-center font-semibold">
                    {error}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          {/* Loading State */}
          <AnimatePresence>
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-blue-300 text-lg animate-pulse font-semibold text-center mt-8"
              >
                Loading medical data...
              </motion.div>
            )}
          </AnimatePresence>
          {/* Results UI */}
          <AnimatePresence>
            {aadharNo && data && !loading && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="w-full mt-4"
              >
                <div className="flex flex-col items-center mb-8">
                  <FaUserCircle className="text-blue-400 text-6xl mb-2" />
                  <div className="text-xl font-extrabold text-blue-200 mb-1">
                    Aadhar No: {data.aadharNo}
                  </div>
                  {data.records[0] && (
                    <>
                      <div className="text-lg font-bold text-purple-300 mb-1">
                        {data.records[0].name}
                      </div>
                      <div className="text-gray-300 mb-1 font-medium">
                        Age: {data.records[0].age} | Gender:{" "}
                        {data.records[0].gender}
                      </div>
                      <div className="text-gray-500 text-sm">
                        Last Updated:{" "}
                        {data.records[0].updatedAt
                          ? new Date(data.records[0].updatedAt).toLocaleString()
                          : "N/A"}
                      </div>
                    </>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Medical Records Timeline */}
                  <div className="bg-gray-800 border border-blue-900 rounded-2xl p-6 shadow-xl">
                    <h4 className="text-lg font-bold text-blue-200 mb-4 flex items-center gap-2">
                      <FaNotesMedical className="text-purple-300" />
                      <span>Medical Records</span>
                    </h4>
                    {data.records.length ? (
                      <div className="relative">
                        {/* Only show the current record */}
                        {(() => {
                          const rec = data.records[currentRecordIndex];
                          return (
                            <div
                              key={rec._id || currentRecordIndex}
                              className="mb-6"
                            >
                              <div className="flex flex-col gap-2">
                                <div className="text-xs text-gray-500 mb-1">
                                  {rec.createdAt
                                    ? new Date(rec.createdAt).toLocaleString()
                                    : "N/A"}
                                </div>
                                <div className="grid grid-cols-1 gap-1 text-sm text-gray-700">
                                  <div>
                                    <strong>Record ID:</strong>{" "}
                                    {rec.recordId || "N/A"}
                                  </div>
                                  <div>
                                    <strong>Weight:</strong>{" "}
                                    {rec.weight || "N/A"}
                                  </div>
                                  <div>
                                    <strong>Height:</strong>{" "}
                                    {rec.height || "N/A"}
                                  </div>
                                  <div>
                                    <strong>BMI:</strong> {rec.bmi || "N/A"}
                                  </div>
                                  <div>
                                    <strong>Blood Pressure:</strong>{" "}
                                    {rec.bloodPressure || "N/A"}
                                  </div>
                                  <div>
                                    <strong>Sugar Level:</strong>{" "}
                                    {rec.sugarLevel || "N/A"}
                                  </div>
                                  <div>
                                    <strong>Cholesterol:</strong>{" "}
                                    {rec.cholesterol || "N/A"}
                                  </div>
                                  <div>
                                    <strong>Allergies:</strong>{" "}
                                    {rec.allergies || "None"}
                                  </div>
                                  <div>
                                    <strong>Past Surgeries:</strong>{" "}
                                    {rec.pastSurgeries || "None"}
                                  </div>
                                  <div>
                                    <strong>Current Medications:</strong>{" "}
                                    {rec.currentMedications || "None"}
                                  </div>
                                  <div>
                                    <strong>Family History:</strong>{" "}
                                    {rec.familyHistory || "None"}
                                  </div>
                                  <div>
                                    <strong>Vaccination History:</strong>{" "}
                                    {rec.vaccinationHistory || "None"}
                                  </div>
                                  <div>
                                    <strong>Dietary Restrictions:</strong>{" "}
                                    {rec.dietaryRestrictions || "None"}
                                  </div>
                                  <div className="mt-2 font-semibold text-blue-800">
                                    Emergency Contact:
                                  </div>
                                  <div className="ml-2">
                                    <strong>Name:</strong>{" "}
                                    {rec.emergencyContact?.name || "N/A"}
                                    <br />
                                    <strong>Relationship:</strong>{" "}
                                    {rec.emergencyContact?.relationship ||
                                      "N/A"}
                                    <br />
                                    <strong>Phone:</strong>{" "}
                                    {rec.emergencyContact?.phone || "N/A"}
                                  </div>
                                  <div className="mt-2 font-semibold text-blue-800">
                                    Mental Health:
                                  </div>
                                  <div className="ml-2">
                                    <strong>Stress Level:</strong>{" "}
                                    {rec.mentalHealth?.stressLevel || "N/A"}
                                    <br />
                                    <strong>Anxiety:</strong>{" "}
                                    {rec.mentalHealth?.anxiety ? "Yes" : "No"}
                                    <br />
                                    <strong>Depression:</strong>{" "}
                                    {rec.mentalHealth?.depression
                                      ? "Yes"
                                      : "No"}
                                  </div>
                                  <div className="mt-2 font-semibold text-blue-800">
                                    Sleep Quality:
                                  </div>
                                  <div className="ml-2">
                                    <strong>Hours Per Night:</strong>{" "}
                                    {rec.sleepQuality?.hoursPerNight || "N/A"}
                                    <br />
                                    <strong>Quality:</strong>{" "}
                                    {rec.sleepQuality?.quality || "N/A"}
                                  </div>
                                  <div className="mt-2 font-semibold text-blue-800">
                                    Lifestyle:
                                  </div>
                                  <div className="ml-2">
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
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                        <div className="flex justify-between mt-4">
                          <motion.button
                            variants={buttonVariants}
                            initial="rest"
                            whileHover="hover"
                            whileTap="tap"
                            className="px-4 py-2 rounded-lg bg-blue-900 text-blue-200 font-semibold shadow hover:bg-blue-800 disabled:opacity-50 transition-colors duration-200"
                            onClick={() =>
                              setCurrentRecordIndex((i) => Math.max(i - 1, 0))
                            }
                            disabled={currentRecordIndex === 0}
                          >
                            Back
                          </motion.button>
                          <span className="text-gray-400 text-sm">
                            {currentRecordIndex + 1} of {data.records.length}
                          </span>
                          <motion.button
                            variants={buttonVariants}
                            initial="rest"
                            whileHover="hover"
                            whileTap="tap"
                            className="px-4 py-2 rounded-lg bg-blue-900 text-blue-200 font-semibold shadow hover:bg-blue-800 disabled:opacity-50 transition-colors duration-200"
                            onClick={() =>
                              setCurrentRecordIndex((i) =>
                                Math.min(i + 1, data.records.length - 1)
                              )
                            }
                            disabled={
                              currentRecordIndex === data.records.length - 1
                            }
                          >
                            Next
                          </motion.button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-500 italic text-center py-8">
                        No medical records found.
                      </div>
                    )}
                  </div>
                  {/* Uploaded Reports Carousel */}
                  <div className="bg-gray-800 border border-pink-900 rounded-2xl p-6 shadow-xl">
                    <h4 className="text-lg font-bold text-pink-300 mb-4 flex items-center gap-2">
                      <FaFilePdf className="text-pink-400" />
                      <span>Uploaded Reports</span>
                    </h4>
                    {data.reports.length ? (
                      <>
                        {(() => {
                          const report = data.reports[currentReportIndex];
                          return (
                            <motion.div
                              key={currentReportIndex}
                              initial={{ opacity: 0, x: 40 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -40 }}
                              transition={{ duration: 0.3 }}
                              className="p-4 border border-emerald-100 rounded-xl shadow bg-white animate-fadein"
                            >
                              <div className="font-semibold text-emerald-700 mb-2 text-lg">
                                {report.reportType} - Dr. {report.doctorName}
                              </div>
                              <div className="text-sm text-gray-500 mb-2">
                                📅{" "}
                                {new Date(
                                  report.reportDate
                                ).toLocaleDateString()}
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
                                      variants={imageVariants}
                                      whileHover="hover"
                                    />
                                  ) : isPdf ? (
                                    <motion.a
                                      key={file._id || idx}
                                      href={`http://localhost:7000/${file.path}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-2 p-3 border rounded-lg bg-red-50 hover:bg-red-100 transition-colors duration-200 shadow"
                                      whileHover={{ scale: 1.05 }}
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
                                    >
                                      Unknown file type
                                    </motion.span>
                                  );
                                })}
                              </div>
                            </motion.div>
                          );
                        })()}
                        <div className="flex justify-between mt-4">
                          <motion.button
                            variants={buttonVariants}
                            initial="rest"
                            whileHover="hover"
                            whileTap="tap"
                            className="px-4 py-2 rounded-lg bg-pink-900 text-pink-200 font-semibold shadow hover:bg-pink-800 disabled:opacity-50 transition-colors duration-200"
                            onClick={() =>
                              setCurrentReportIndex((i) => Math.max(i - 1, 0))
                            }
                            disabled={currentReportIndex === 0}
                          >
                            Back
                          </motion.button>
                          <span className="text-gray-400 text-sm">
                            {currentReportIndex + 1} of {data.reports.length}
                          </span>
                          <motion.button
                            variants={buttonVariants}
                            initial="rest"
                            whileHover="hover"
                            whileTap="tap"
                            className="px-4 py-2 rounded-lg bg-pink-900 text-pink-200 font-semibold shadow hover:bg-pink-800 disabled:opacity-50 transition-colors duration-200"
                            onClick={() =>
                              setCurrentReportIndex((i) =>
                                Math.min(i + 1, data.reports.length - 1)
                              )
                            }
                            disabled={
                              currentReportIndex === data.reports.length - 1
                            }
                          >
                            Next
                          </motion.button>
                        </div>
                      </>
                    ) : (
                      <div className="text-gray-500 italic text-center py-8">
                        No reports uploaded.
                      </div>
                    )}
                    {data.reports.length > 1 && (
                      <div className="flex gap-2 mt-6 justify-center">
                        {data.reports.map((report, i) => {
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
                              className="w-12 h-12 object-cover rounded-full border-2 border-pink-700 shadow"
                              variants={imageVariants}
                              whileHover="hover"
                            />
                          ) : (
                            <motion.div
                              key={report._id || i}
                              className="w-12 h-12 flex items-center justify-center rounded-full bg-pink-900 text-pink-200 font-bold border-2 border-pink-700 shadow text-lg"
                            >
                              {report.reportType?.[0] || "?"}
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
                <motion.button
                  variants={buttonVariants}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                  onClick={handleChoosePhoto}
                  className="mt-10 bg-blue-700 hover:bg-blue-900 text-gray-100 font-bold py-2 rounded-lg shadow-lg transition-colors text-base w-full"
                >
                  Start Over
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyzeReport;
