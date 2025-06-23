import React, { useState, useRef } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import { motion } from "framer-motion";

const API_KEY = "AIzaSyD1OwQsLBGjV397BTqBH4oOhbd3IBy1gNU";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

const systemPrompt = `
  You are a domain expert in medical image analysis. You are tasked with 
  examining medical images for a renowned hospital.
  Your expertise will help in identifying or 
  discovering any anomalies, diseases, conditions or
  any health issues that might be present in the image.
  
  Your key responsibilites:
  1. Detailed Analysis : Scrutinize and thoroughly examine each image, 
  focusing on finding any abnormalities.
  2. Analysis Report : Document all the findings and 
  clearly articulate them in a structured format.
  3. Recommendations : Basis the analysis, suggest remedies, 
  tests or treatments as applicable.
  4. Treatments : If applicable, lay out detailed treatments 
  which can help in faster recovery.
  
  Important Notes to remember:
  1. Scope of response : Only respond if the image pertains to 
  human health issues.
  2. Clarity of image : In case the image is unclear, 
  note that certain aspects are 
  'Unable to be correctly determined based on the uploaded image'
  3. Disclaimer : Accompany your analysis with the disclaimer: 
  "Consult with a Doctor before making any decisions."
  4. Your insights are invaluable in guiding clinical decisions. 
  Please proceed with the analysis, adhering to the 
  structured approach outlined above.
  
  Please provide the final response with these 4 headings : 
  Detailed Analysis, Analysis Report, Recommendations and Treatments
  
`;

const AiAnalyze = () => {
  const [files, setFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef();
  const [isDragActive, setIsDragActive] = useState(false);
  const [chats, setChats] = useState([]);
  const [chatInputs, setChatInputs] = useState([]);
  const [chatLoading, setChatLoading] = useState([]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    // Filter out duplicates by name and size
    const existingFiles = files.map((f) => f.name + f.size);
    const newFiles = selectedFiles.filter(
      (f) => !existingFiles.includes(f.name + f.size)
    );
    const updatedFiles = [...files, ...newFiles];
    setFiles(updatedFiles);
    setImagePreviews(updatedFiles.map((file) => URL.createObjectURL(file)));
    setResults([]);
    setError(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => setIsDragActive(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    handleFileChange({ target: { files: e.dataTransfer.files } });
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const generateAnalysis = async () => {
    setLoading(true);
    setError(null);
    const allResults = [];
    try {
      for (const file of files) {
        const base64Image = await toBase64(file);
        const requestBody = {
          contents: [
            {
              parts: [
                {
                  inlineData: {
                    mimeType: file.type,
                    data: base64Image.split(",")[1],
                  },
                },
                { text: systemPrompt },
              ],
            },
          ],
        };
        const response = await axios.post(GEMINI_URL, requestBody);
        const result =
          response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
          "No response";
        allResults.push(result);
      }
      setResults(allResults);
      setChats(allResults.map(() => []));
      setChatInputs(allResults.map(() => ""));
      setChatLoading(allResults.map(() => false));
    } catch (error) {
      setError("Error generating analysis.");
      setResults(files.map(() => "Error generating analysis."));
      setChats(files.map(() => []));
      setChatInputs(files.map(() => ""));
      setChatLoading(files.map(() => false));
    }
    setLoading(false);
  };

  const handleChatInputChange = (idx, value) => {
    setChatInputs((prev) => prev.map((v, i) => (i === idx ? value : v)));
  };

  const handleSendChat = async (idx) => {
    const question = chatInputs[idx]?.trim();
    if (!question) return;
    setChatLoading((prev) => prev.map((v, i) => (i === idx ? true : v)));
    setChats((prev) =>
      prev.map((chat, i) =>
        i === idx ? [...chat, { role: "user", text: question }] : chat
      )
    );
    setChatInputs((prev) => prev.map((v, i) => (i === idx ? "" : v)));
    try {
      const context =
        "Report Analysis:\n" +
        results[idx] +
        "\n\nChat History:\n" +
        chats[idx]
          .map((msg) => `${msg.role === "user" ? "User" : "AI"}: ${msg.text}`)
          .join("\n") +
        `\n\nUser: ${question}\nAI:`;
      const requestBody = {
        contents: [
          {
            parts: [{ text: context }],
          },
        ],
      };
      const response = await axios.post(GEMINI_URL, requestBody);
      const aiText =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response";
      setChats((prev) =>
        prev.map((chat, i) =>
          i === idx ? [...chat, { role: "ai", text: aiText }] : chat
        )
      );
    } catch (err) {
      setChats((prev) =>
        prev.map((chat, i) =>
          i === idx
            ? [...chat, { role: "ai", text: "Error getting response." }]
            : chat
        )
      );
    }
    setChatLoading((prev) => prev.map((v, i) => (i === idx ? false : v)));
  };

  const downloadText = (index) => {
    const blob = new Blob([results[index]], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `analysis-${index + 1}.txt`;
    link.click();
  };

  const downloadPDF = (index) => {
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(results[index], 180);
    doc.text(lines, 10, 10);
    doc.save(`analysis-${index + 1}.pdf`);
  };

  const handleRemoveImage = (index) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
    setImagePreviews(updatedFiles.map((file) => URL.createObjectURL(file)));
    if (updatedFiles.length === 0) {
      setResults([]);
      setError(null);
      fileInputRef.current.value = null;
    }
  };

  const handleStartOver = () => {
    setFiles([]);
    setImagePreviews([]);
    setResults([]);
    setError(null);
    fileInputRef.current.value = null;
  };

  return (
    <>
      {/* Orbitron font and custom styles */}
      <link
        href="https://fonts.googleapis.com/css2?family=Orbitron:wght@700&display=swap"
        rel="stylesheet"
      />
      <style>{`body { background: none !important; } .orbitron { font-family: 'Orbitron', sans-serif; }`}</style>
      {/* Animated gradient background and dots */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#181c2f] via-[#23284a] to-[#181c2f] w-full h-full -z-10" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="min-h-screen relative flex flex-col items-center px-2 py-6 sm:py-8 pt-40"
      >
        {/* Animated dots */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-blue-300 opacity-20"
              style={{
                width: `${8 + (i % 3) * 4}px`,
                height: `${8 + (i % 3) * 4}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `floatDot 6s ease-in-out infinite ${i * 0.5}s`,
              }}
            />
          ))}
          <style>{`
            @keyframes floatDot {
              0%, 100% { transform: translateY(0); opacity: 0.7; }
              50% { transform: translateY(-30px); opacity: 1; }
            }
          `}</style>
        </div>
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-20 -z-10 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 255, 255, 0.08) 1px, transparent 1px),\n                           linear-gradient(90deg, rgba(0, 255, 255, 0.08) 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>
        {/* Animated scanning line */}
        <motion.div
          className="absolute top-0 left-0 w-1 h-full bg-cyan-400/40 blur-lg z-0 pointer-events-none"
          initial={{ x: "-5%" }}
          animate={{ x: ["-5%", "105%"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
        {/* Animated waveform */}
        <svg
          className="absolute bottom-0 left-0 w-full h-20 sm:h-32 opacity-30 -z-10 pointer-events-none"
          viewBox="0 0 1440 320"
        >
          <motion.path
            fill="#22d3ee"
            fillOpacity="0.2"
            d="M0,160L60,170.7C120,181,240,203,360,197.3C480,192,600,160,720,154.7C840,149,960,171,1080,186.7C1200,203,1320,213,1380,218.7L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: [0.8, 1, 0.8] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
        {/* Main Content */}
        <div className="relative z-10 w-full flex flex-col items-center mt-40">
          {/* Hero Section */}
          <div className="relative w-full flex flex-col items-center mb-6 sm:mb-10 px-2">
            <svg
              className="absolute -top-10 sm:-top-20 left-0 w-full h-32 sm:h-60"
              viewBox="0 0 1440 320"
            >
              <path
                fill="#a78bfa"
                fillOpacity="0.3"
                d="M0,160L60,170.7C120,181,240,203,360,197.3C480,192,600,160,720,154.7C840,149,960,171,1080,186.7C1200,203,1320,213,1380,218.7L1440,224L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
              />
            </svg>
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg z-10 orbitron text-center leading-tight">
              MediPal AI Visual Medical Assistant
            </h1>
            <p className="text-base xs:text-lg sm:text-xl text-cyan-200 mt-2 z-10 text-center">
              Upload, scan, and get instant AI-powered analysis of your medical
              images
            </p>
          </div>
          {/* Upload/Preview Card */}
          {files.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, type: "spring" }}
              className="bg-white/20 backdrop-blur-2xl border border-blue-200/30 shadow-2xl rounded-3xl p-4 xs:p-6 sm:p-8 md:p-10 transition-all duration-500 flex flex-col items-center w-full max-w-xs xs:max-w-sm sm:max-w-md md:max-w-lg"
            >
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center w-full"
              >
                <span className="text-blue-200 text-base xs:text-lg mb-2 text-center">
                  Upload one or more medical images for analysis
                </span>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="hidden"
                />
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`w-32 h-32 xs:w-40 xs:h-40 sm:w-48 sm:h-48 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-300 relative group ${
                    isDragActive
                      ? "border-cyan-400 bg-cyan-100/20"
                      : "border-blue-400 bg-blue-900/30"
                  }`}
                >
                  <motion.div
                    initial={{ scale: 1 }}
                    animate={{ scale: isDragActive ? 1.08 : 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="flex flex-col items-center justify-center h-full w-full"
                  >
                    <span className="text-4xl xs:text-5xl mb-2">🩺</span>
                    <span className="text-blue-400 text-center text-sm xs:text-base">
                      {isDragActive
                        ? "Drop files here!"
                        : "Click or drag images"}
                    </span>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isDragActive ? 0.2 : 0 }}
                    className="absolute inset-0 bg-cyan-200 rounded-2xl pointer-events-none"
                  />
                </div>
              </label>
              {error && (
                <div className="text-red-400 mt-2 text-sm text-center">
                  {error}
                </div>
              )}
            </motion.div>
          )}
          {/* Preview and Analyze Card */}
          {files.length > 0 && results.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, type: "spring" }}
              className="bg-[#23284a]/90 border border-blue-900 shadow-2xl rounded-3xl p-4 xs:p-6 sm:p-8 md:p-10 transition-all duration-500 flex flex-col items-center w-full max-w-xs xs:max-w-sm sm:max-w-lg md:max-w-2xl"
            >
              <div className="flex flex-wrap gap-2 xs:gap-3 sm:gap-4 justify-center mb-4 xs:mb-6">
                {imagePreviews.map((src, idx) => (
                  <div key={idx} className="relative group">
                    <motion.img
                      src={src}
                      alt={`Preview ${idx + 1}`}
                      className="rounded-xl w-24 h-20 xs:w-32 xs:h-24 sm:w-40 sm:h-32 object-cover border-2 border-blue-700 shadow-lg"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1, duration: 0.5 }}
                    />
                    <button
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 xs:w-6 xs:h-6 flex items-center justify-center text-xs opacity-80 hover:opacity-100 transition z-20"
                      title="Remove image"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              {/* Always show Add More Images button and upload input */}
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center w-full mb-2 xs:mb-4"
              >
                <span className="text-blue-200 text-base xs:text-lg mb-2">
                  Add More Images
                </span>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="hidden"
                />
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`w-20 h-20 xs:w-24 xs:h-24 sm:w-32 sm:h-32 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-300 relative group ${
                    isDragActive
                      ? "border-cyan-400 bg-cyan-100/20"
                      : "border-blue-400 bg-blue-900/30"
                  }`}
                >
                  <motion.div
                    initial={{ scale: 1 }}
                    animate={{ scale: isDragActive ? 1.08 : 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="flex flex-col items-center justify-center h-full w-full"
                  >
                    <span className="text-2xl xs:text-3xl mb-2">🩺</span>
                    <span className="text-blue-400 text-center text-xs xs:text-sm">
                      {isDragActive
                        ? "Drop files here!"
                        : "Click or drag images"}
                    </span>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isDragActive ? 0.2 : 0 }}
                    className="absolute inset-0 bg-cyan-200 rounded-2xl pointer-events-none"
                  />
                </div>
              </label>
              {loading && (
                <div className="w-full bg-gradient-to-r from-cyan-200 to-blue-200 rounded-full h-3 xs:h-4 mt-2 flex items-center">
                  <motion.div
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 h-3 xs:h-4 rounded-full"
                    style={{ width: `100%` }}
                    animate={{ scaleX: [1, 1.05, 1] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.2,
                      ease: "easeInOut",
                    }}
                  />
                  <span className="ml-2 text-blue-700 text-xs xs:text-sm font-medium">
                    Analyzing...
                  </span>
                </div>
              )}
              {error && (
                <div className="text-red-400 mt-2 text-sm text-center">
                  {error}
                </div>
              )}
              <div className="flex flex-col xs:flex-row gap-2 xs:gap-4 mt-4 xs:mt-6 w-full">
                <button
                  onClick={generateAnalysis}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-green-400 to-cyan-500 hover:from-green-500 hover:to-cyan-600 text-white font-bold py-2 xs:py-3 rounded-lg shadow-lg transition-colors text-base xs:text-lg disabled:bg-green-300"
                >
                  {loading ? "Analyzing..." : "Generate Analysis"}
                </button>
              </div>
            </motion.div>
          )}
          {/* Results Card */}
          {results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, type: "spring" }}
              className="relative bg-white/10 backdrop-blur-md shadow-2xl rounded-3xl p-4 xs:p-6 sm:p-8 md:p-10 max-w-5xl w-full mx-auto overflow-hidden border border-cyan-400/30 mt-8 xs:mt-10 md:mt-12"
            >
              {/* Animated gradient border */}
              <div
                className="absolute inset-0 rounded-3xl pointer-events-none z-0"
                style={{
                  border: "3px solid transparent",
                  background:
                    "linear-gradient(120deg, #22d3ee, #a78bfa, #22d3ee) border-box",
                  maskImage:
                    "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                }}
              />
              {/* Floating glowing icon */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0, y: -30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 0.7, type: "spring" }}
                className="absolute -top-8 left-1/2 -translate-x-1/2 z-10"
              >
                <div className="bg-gradient-to-br from-cyan-400 to-blue-400 p-3 xs:p-4 rounded-full shadow-lg border-4 border-white/30 animate-pulse">
                  <span className="text-white text-2xl xs:text-3xl">🤖</span>
                </div>
              </motion.div>
              <div className="relative z-20 flex flex-col">
                <div className="flex items-center gap-2 xs:gap-3 mb-2 justify-center">
                  <h2 className="font-bold text-base xs:text-lg text-blue-100 orbitron">
                    AI Analysis Result
                  </h2>
                </div>
                {imagePreviews.map((src, idx) => (
                  <div key={idx} className="mb-6 xs:mb-8">
                    <div className="flex flex-col md:flex-row gap-10 lg:gap-16 items-stretch min-w-0 overflow-x-auto">
                      {/* Left: Image + Analysis */}
                      <div className="flex-1 min-w-0 min-h-[12rem]">
                        <img
                          src={src}
                          alt={`Preview ${idx}`}
                          className="rounded-xl w-32 h-24 sm:w-40 sm:h-32 object-cover border-2 border-blue-700 shadow-lg mb-2"
                        />
                        <div className="text-gray-100 whitespace-pre-line break-words text-sm xs:text-base mb-2">
                          {results[idx]}
                        </div>
                        <div className="flex space-x-2 mt-2">
                          <button
                            onClick={() => downloadText(idx)}
                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                          >
                            Download .txt
                          </button>
                          <button
                            onClick={() => downloadPDF(idx)}
                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                          >
                            Download PDF
                          </button>
                        </div>
                      </div>
                      {/* Right: Chat Panel */}
                      <div className="w-full md:w-[420px] lg:w-[500px] min-w-0 bg-white/10 rounded-xl p-4 border border-cyan-400/30 shadow flex flex-col justify-between h-full">
                        <div>
                          <div className="font-semibold text-cyan-200 mb-2 text-right md:text-left">
                            Ask about this report
                          </div>
                          <div
                            className="overflow-y-auto max-h-[32rem] md:max-h-[40rem] mb-2 space-y-2 scrollbar-none"
                            style={{
                              scrollbarWidth: "none",
                              msOverflowStyle: "none",
                            }}
                          >
                            <style>{`
                              .scrollbar-none::-webkit-scrollbar { display: none; }
                            `}</style>
                            {chats[idx]?.map((msg, i) => (
                              <div
                                key={i}
                                className={`flex ${
                                  msg.role === "user"
                                    ? "justify-end"
                                    : "justify-start"
                                }`}
                              >
                                <div
                                  className={`px-3 py-2 rounded-lg max-w-xs text-sm shadow
                                    ${
                                      msg.role === "user"
                                        ? "bg-cyan-500 text-white"
                                        : "bg-blue-100 text-blue-900"
                                    }`}
                                >
                                  {msg.text}
                                </div>
                              </div>
                            ))}
                            {chatLoading[idx] && (
                              <div className="flex justify-start">
                                <div className="px-3 py-2 rounded-lg bg-blue-100 text-blue-900 max-w-xs text-sm shadow animate-pulse">
                                  AI is typing...
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <form
                          className="flex gap-2 mt-2"
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleSendChat(idx);
                          }}
                        >
                          <input
                            type="text"
                            className="flex-1 rounded-lg px-3 py-2 text-sm bg-white/80 border border-cyan-300 focus:outline-none"
                            placeholder="Ask a question about this report..."
                            value={chatInputs[idx] || ""}
                            onChange={(e) =>
                              handleChatInputChange(idx, e.target.value)
                            }
                            disabled={chatLoading[idx]}
                            maxLength={300}
                          />
                          <button
                            type="submit"
                            className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg font-semibold disabled:bg-cyan-300"
                            disabled={
                              chatLoading[idx] ||
                              !(chatInputs[idx] && chatInputs[idx].trim())
                            }
                          >
                            Send
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  onClick={handleStartOver}
                  className="mt-6 xs:mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg shadow-lg transition-colors text-base w-full"
                >
                  Start Over
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default AiAnalyze;
