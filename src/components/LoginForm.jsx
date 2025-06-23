import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaApple, FaGoogle } from "react-icons/fa";
import API from "../api";

// Add custom CSS for animated background
const animatedBgStyle = {
  background: "linear-gradient(-45deg, #10121A, #18191c, #232323, #0a0a23)",
  backgroundSize: "400% 400%",
  animation: "gradientMove 15s ease infinite",
};

const LoginForm = () => {
  const [form, setForm] = useState({ Email: "", Password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      toast.success("Login successful!", { position: "top-right" });
      navigate("/");
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Login failed";
      setErrorMessage(errorMsg);
      toast.error(errorMsg, { position: "top-right" });
    }
  };

  return (
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
          <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-gray-400 mb-8">
            Don't have an account yet?{" "}
            <span
              className="text-blue-400 hover:underline cursor-pointer"
              onClick={() => navigate("/signup")}
            >
              Sign up
            </span>
          </p>
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-900/30 text-red-400 rounded-lg text-base border border-red-800 text-center">
              {errorMessage}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="email"
              name="Email"
              value={form.Email}
              onChange={handleChange}
              placeholder="Email address"
              className="w-full px-4 py-3 rounded-lg bg-[#18191c] text-white focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              required
            />
            <input
              type="password"
              name="Password"
              value={form.Password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-4 py-3 rounded-lg bg-[#18191c] text-white focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              required
            />
            <button
              type="submit"
              className="w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 shadow-lg mt-2"
            >
              Login
            </button>
          </form>
          <div className="flex w-full gap-4">
            {/* Removed Google and Apple login buttons */}
          </div>
        </div>
        {/* Right: Branding/Graphic */}
        <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-[#10121A] to-[#232323] relative">
          {/* Logo/graphic placeholder */}
          <div className="mb-8">
            <span className="text-7xl text-white font-bold">🤖</span>
          </div>
          <h1 className="text-2xl font-bold text-[#7fffd4] mb-2 tracking-wide">
            MEDIPAL
          </h1>
          <p className="text-white text-center mb-6 max-w-xs">
            AI Powered Medical Report Analysis
          </p>
          <ul className="text-gray-300 text-sm space-y-2">
            <li>✔ We secure user medical reports via Aadhar Number</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
