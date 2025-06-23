import React from "react";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-gray-300 overflow-hidden">
      {/* Futuristic Grid Background */}
      <div className="pointer-events-none absolute inset-0 opacity-20 z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),\n                           linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>
      {/* Glowing Dots */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {[...Array(7)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-500 rounded-full"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-4 lg:px-8 py-6 md:py-6 lg:py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="space-y-1 md:space-y-2">
            <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 text-base md:text-lg font-semibold">
              About MediPal
            </h3>
            <p className="text-xs md:text-sm">
              Your comprehensive platform for managing medical history and
              doctor appointments.
            </p>
          </div>

          <div className="space-y-1 md:space-y-2">
            <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 text-base md:text-lg font-semibold">
              Quick Links
            </h3>
            <ul className="space-y-1">
              <li>
                <a
                  href="/"
                  className="text-xs md:text-sm hover:text-cyan-400 transition-colors duration-200"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/appointments"
                  className="text-xs md:text-sm hover:text-cyan-400 transition-colors duration-200"
                >
                  Book Appointment
                </a>
              </li>
              <li>
                <a
                  href="/medical-history"
                  className="text-xs md:text-sm hover:text-cyan-400 transition-colors duration-200"
                >
                  Medical History
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-1 md:space-y-2">
            <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 text-base md:text-lg font-semibold">
              Contact Info
            </h3>
            <div className="mt-2 space-y-1">
              <p className="text-xs md:text-sm flex items-center gap-2">
                <span role="img" aria-label="Gmail">
                  📧
                </span>
                <a
                  href="mailto:medipal247@gmail.com"
                  className="hover:text-cyan-400 transition-colors duration-200"
                >
                  medipal247@gmail.com
                </a>
              </p>
              <p className="text-xs md:text-sm flex items-center gap-2">
                <span role="img" aria-label="YouTube">
                  📺
                </span>
                <a
                  href="https://youtube.com/@MediPal247"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 transition-colors duration-200"
                >
                  @MediPal247
                </a>
              </p>
              <p className="text-xs md:text-sm flex items-center gap-2">
                <span role="img" aria-label="Instagram">
                  📸
                </span>
                <a
                  href="https://instagram.com/medipal.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 transition-colors duration-200"
                >
                  medipal.in
                </a>
              </p>
              <p className="text-xs md:text-sm flex items-center gap-2">
                <span role="img" aria-label="Facebook">
                  📘
                </span>
                <a
                  href="https://facebook.com/MediPalHealthcare"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 transition-colors duration-200"
                >
                  MediPal Healthcare
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-cyan-500/30">
          <p className="text-xs md:text-sm text-center">
            &copy; {new Date().getFullYear()} MediPal. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
