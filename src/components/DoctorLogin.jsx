import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API from "axios";
import Navbar from "./Navbar";

// Add custom CSS for animated background
const animatedBgStyle = {
  background: "linear-gradient(-45deg, #10121A, #18191c, #232323, #0a0a23)",
  backgroundSize: "400% 400%",
  animation: "gradientMove 15s ease infinite",
};

const DoctorLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("doctor"); // 'doctor' or 'admin'
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      let endpoint = "";
      let storageKey = "";
      let successRedirect = "";
      if (role === "doctor") {
        endpoint = "https://medipalbackend.onrender.com/api/doctor/login";
        storageKey = "doctorToken";
        successRedirect = "/doctor";
      } else {
        endpoint = "https://medipalbackend.onrender.com/api/admin/login";
        storageKey = "adminToken";
        successRedirect = "/admin";
      }
      const response = await API.post(endpoint, {
        email,
        password,
      });

      if (response.data.success) {
        toast.success(
          `${
            role.charAt(0).toUpperCase() + role.slice(1)
          } logged in successfully`
        );
        localStorage.setItem(storageKey, response.data.token);
        navigate(successRedirect);
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Login failed. Please check your credentials.");
    }
  };

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
      />
      <div
        className="min-h-screen w-full flex items-center justify-center pt-20 md:pt-28"
        style={animatedBgStyle}
      >
        {/* Split layout */}
        <style>{`
          @keyframes gradientMove {
            0% {background-position: 0% 50%;}
            50% {background-position: 100% 50%;}
            100% {background-position: 0% 50%;}
          }
        `}</style>
        <div className="flex w-[900px] h-[600px] rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-white/5 backdrop-blur-lg">
          {/* Left: Login Form */}
          <div className="flex-1 flex flex-col justify-center px-12 py-10 bg-white/10 backdrop-blur-lg">
            {/* Role Toggle */}
            <div className="flex justify-center mb-6">
              <button
                type="button"
                className={`px-4 py-2 rounded-l-lg font-semibold border border-white/20 transition-all ${
                  role === "doctor"
                    ? "bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 text-white"
                    : "bg-[#18191c] text-gray-300 hover:bg-white/10"
                }`}
                onClick={() => setRole("doctor")}
              >
                Doctor Login
              </button>
              <button
                type="button"
                className={`px-4 py-2 rounded-r-lg font-semibold border border-white/20 transition-all ${
                  role === "admin"
                    ? "bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 text-white"
                    : "bg-[#18191c] text-gray-300 hover:bg-white/10"
                }`}
                onClick={() => setRole("admin")}
              >
                Admin Login
              </button>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-gray-400 mb-8">
              Log in to your {role === "doctor" ? "Doctor" : "Admin"} dashboard
              to manage appointments, records, and more.
            </p>
            <form onSubmit={handleLogin} className="space-y-5">
              <input
                className="w-full px-4 py-3 rounded-lg bg-[#18191c] text-white focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                autoComplete="username"
              />
              <input
                className="w-full px-4 py-3 rounded-lg bg-[#18191c] text-white focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              <button
                className="w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 shadow-lg mt-2"
                type="submit"
              >
                Login
              </button>
            </form>
            <div className="text-center text-gray-400 text-xs mt-4">
              Forgot password?{" "}
              <span className="text-blue-400 cursor-pointer hover:underline">
                Contact support
              </span>
            </div>
          </div>
          {/* Right: Branding/Graphic */}
          <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-[#10121A] to-[#232323]">
            <h1 className="text-2xl font-bold text-[#7fffd4] mb-2 tracking-wide">
              MEDIPAL
            </h1>
            <p className="text-white text-center mb-6 max-w-xs">
              AI Powered Medical Report Analysis
            </p>
            <ul className="text-gray-300 text-sm space-y-2">
              <li>
                ✔ Secure {role === "doctor" ? "Doctor" : "Admin"} Dashboard
              </li>
              <li>✔ Manage Appointments & Records</li>
              <li>✔ AI-Powered Analysis Tools</li>
            </ul>
            <div className="mt-8 text-sm text-gray-400">
              &copy; {new Date().getFullYear()} MediPal
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DoctorLogin;
