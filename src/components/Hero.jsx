import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const Particle = ({ x, y, size, color, delay }) => (
  <motion.div
    className="absolute rounded-full"
    style={{
      width: size,
      height: size,
      backgroundColor: color,
      x,
      y,
    }}
    animate={{
      y: [y, y - 100],
      opacity: [0, 1, 0],
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      delay,
    }}
  />
);

const HealthMetric = ({ label, value, icon, delay }) => (
  <motion.div
    className="absolute w-20 h-20 bg-white/10 backdrop-blur-sm border border-cyan-500/30 shadow-lg rounded-xl flex flex-col items-center justify-center p-2"
    style={{
      top: `${50 + 40 * Math.sin((delay * Math.PI) / 3)}%`,
      left: `${50 + 40 * Math.cos((delay * Math.PI) / 3)}%`,
    }}
    animate={{
      y: [0, -10, 0],
      opacity: [0.7, 1, 0.7],
      scale: [1, 1.05, 1],
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      delay: delay * 0.2,
    }}
  >
    <div className="text-cyan-400 text-xs mb-1">{label}</div>
    <div className="text-gray-100 text-lg font-semibold">{value}</div>
    <div className="text-cyan-400 text-xs mt-1">{icon}</div>
  </motion.div>
);

const Hero = () => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const healthMetrics = [
    { label: "Heart Rate", value: "72 BPM", icon: "❤️" },
    { label: "Blood Pressure", value: "120/80", icon: "🫀" },
    { label: "Blood Sugar", value: "5.6", icon: "🩸" },
    { label: "Weight", value: "68 kg", icon: "⚖️" },
    { label: "Sleep", value: "7.5h", icon: "😴" },
    { label: "Steps", value: "8.2k", icon: "👣" },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
      {/* Futuristic Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Glowing Server Room Effect */}
      <div className="absolute inset-0">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-500 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>

      {/* Biometric Lock Rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-cyan-500"
            style={{
              width: `${(i + 1) * 200}px`,
              height: `${(i + 1) * 200}px`,
            }}
            animate={{
              rotate: 360,
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
              delay: i * 2,
            }}
          />
        ))}
      </div>

      {/* Holographic Data Cards */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-32 h-48 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-sm rounded-lg border border-cyan-500/30"
          style={{
            left: `${20 + i * 15}%`,
            top: `${30 + Math.sin(i) * 20}%`,
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        >
          <div className="p-4 text-cyan-400 text-xs">
            <div className="font-mono">MED_REC_{i + 1}</div>
            <div className="mt-2 opacity-50">••••••••</div>
          </div>
        </motion.div>
      ))}

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 mt-24 py-20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Content */}
          <div className="flex-1 text-gray-100 space-y-8">
            <motion.h1
              className="text-5xl md:text-6xl font-bold leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Your Health DNA—
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                Digitized
              </span>
            </motion.h1>

            <motion.p
              className="text-xl text-gray-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Powered by AI, your medical records transform into personalized
              health insights. Every record builds your unique health genome.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <button
                className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full text-white font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl relative overflow-hidden"
                onClick={() => navigate("/analyze")}
              >
                <span className="relative z-10">Get Started</span>
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.5 }}
                />
              </button>
              <button className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-cyan-500/30 rounded-full text-cyan-400 font-semibold hover:bg-white/20 transition-all duration-300">
                Learn More
              </button>
            </motion.div>

            {/* Health Stats Preview */}
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {["24/7", "100%", "AI-Powered", "Secure"].map((stat, i) => (
                <div
                  key={i}
                  className="bg-white/10 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-4 text-center"
                >
                  <div className="text-2xl font-bold text-cyan-400">{stat}</div>
                  <div className="text-sm text-gray-300">
                    {["Monitoring", "Accuracy", "Analysis", "Storage"][i]}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Moving Aadhar Card Icon */}
      <motion.div
        className="fixed bottom-8 right-8 z-50 cursor-pointer"
        initial={{ y: 0, rotate: 0 }}
        animate={{
          y: [0, -20, 0],
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "loop",
        }}
        style={{ width: 80, height: 50 }}
        onClick={() => navigate("/analyze")}
      >
        <img
          src={logo}
          alt="Aadhar Card"
          className="w-full h-full object-contain drop-shadow-lg rounded-full border border-cyan-400 bg-white/80"
        />
        </motion.div>
    </div>
  );
};

export default Hero;
