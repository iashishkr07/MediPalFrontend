import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Navbar from "./Navbar";

const SignUpForm = () => {
  const [form, setForm] = useState({
    FullName: "",
    Email: "",
    Phone: "",
    Password: "",
    ConfirmPassword: "",
    profilePic: null,
    aadharImg: null,
    AadharNo: "",
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [previewAadhar, setPreviewAadhar] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const aadharInputRef = useRef(null);

  const animatedBgStyle = {
    background: "linear-gradient(-45deg, #10121A, #18191c, #232323, #0a0a23)",
    backgroundSize: "400% 400%",
    animation: "gradientMove 15s ease infinite",
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.FullName.trim()) newErrors.FullName = "Full name is required";
    if (form.FullName.length > 50) newErrors.FullName = "Name is too long";

    if (!form.Email.trim()) newErrors.Email = "Email is required";
    else if (!emailRegex.test(form.Email))
      newErrors.Email = "Invalid email format";

    if (!form.Password) newErrors.Password = "Password is required";
    else if (form.Password.length < 6)
      newErrors.Password = "Password must be at least 6 characters";
    else if (form.Password.length > 50)
      newErrors.Password = "Password is too long";

    if (form.Password !== form.ConfirmPassword)
      newErrors.ConfirmPassword = "Passwords do not match";

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePic") {
      const file = files[0];
      setForm({ ...form, profilePic: file });

      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setPreviewImage(null);
      }
    } else if (name === "aadharImg") {
      const file = files[0];
      setForm({ ...form, aadharImg: file });

      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const imageData = reader.result;
          setPreviewAadhar(imageData);
        };
        reader.readAsDataURL(file);
      } else {
        setPreviewAadhar(null);
      }
    } else {
      setForm({ ...form, [name]: value });
    }
    setErrors({ ...errors, [name]: "" });
  };

  const triggerFileInput = (ref) => {
    ref.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("FullName", form.FullName);
      formData.append("Email", form.Email);
      formData.append("Phone", form.Phone);
      formData.append("Password", form.Password);
      formData.append("AadharNo", form.AadharNo);
      if (form.profilePic) {
        formData.append("profilePic", form.profilePic);
      }
      if (form.aadharImg) {
        formData.append("aadharImg", form.aadharImg);
      }

      for (let pair of formData.entries()) {
        console.log(pair[0] + ", " + pair[1]);
      }

      const res = await axios.post(
        "https://medipalbackend.onrender.com/api/signup",
        formData
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Account created successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setTimeout(() => {
        navigate("/login");
      }, 1000); // 1 second delay for toast
    } catch (error) {
      const message = error.response?.data?.message;
      if (message?.toLowerCase().includes("email")) {
        setErrors({ ...errors, Email: message });
      } else if (message?.toLowerCase().includes("password")) {
        setErrors({ ...errors, Password: message });
      } else {
        toast.error(message || "Signup failed. Please try again.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setErrors({
          ...errors,
          form: message || "Signup failed. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "relative", zIndex: 0 }}>
      <Navbar />
      <div
        className="min-h-screen w-full flex items-center justify-center p-4 pt-24"
        style={{ ...animatedBgStyle, minHeight: "100vh", zIndex: 0 }}
      >
        <style>{`
        @keyframes gradientMove {
          0% {background-position: 0% 50%;}
          50% {background-position: 100% 50%;}
          100% {background-position: 0% 50%;}
        }
      `}</style>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
        <div className="flex w-full max-w-4xl h-auto md:h-[600px] rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-white/5 backdrop-blur-lg">
          {/* Left: Signup Form */}
          <div className="flex-1 flex flex-col justify-center px-6 md:px-12 py-10 bg-white/10 backdrop-blur-lg overflow-y-auto">
            <h2 className="text-3xl font-bold text-white mb-2">
              Create an Account
            </h2>
            <p className="text-gray-400 mb-6">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-400 hover:underline cursor-pointer"
              >
                Login here
              </Link>
            </p>

            {errors.form && (
              <div className="mb-4 p-3 bg-red-900/30 text-red-400 rounded-lg text-base border border-red-800 text-center">
                {errors.form}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Image Uploads */}
                <div className="flex flex-col xs:flex-row md:flex-col items-center gap-4">
                  <div
                    className="relative w-32 h-32 rounded-full bg-white/10 border-2 border-dashed border-gray-500 flex items-center justify-center cursor-pointer overflow-hidden hover:border-blue-400 transition-colors duration-300"
                    onClick={() => triggerFileInput(fileInputRef)}
                  >
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center text-gray-400">
                        <span className="text-4xl block mb-1">+</span>
                        <span>Upload Photo</span>
                      </div>
                    )}
                  </div>

                  <div
                    className="relative w-full xs:w-32 md:w-full h-32 rounded-lg bg-white/10 border-2 border-dashed border-gray-500 flex items-center justify-center cursor-pointer overflow-hidden hover:border-blue-400 transition-colors duration-300"
                    onClick={() => triggerFileInput(aadharInputRef)}
                  >
                    {previewAadhar ? (
                      <img
                        src={previewAadhar}
                        alt="Aadhar Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center text-gray-400">
                        <span className="text-4xl block mb-1">+</span>
                        <span>Upload Aadhar</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm_custom:grid-cols-2 md:grid-cols-1 gap-4">
                    <div>
                      <input
                        type="text"
                        name="FullName"
                        value={form.FullName}
                        onChange={handleChange}
                        disabled={loading}
                        className="w-full px-4 py-3 rounded-lg bg-[#18191c] text-white focus:ring-2 focus:ring-blue-500 placeholder-gray-500 border-none"
                        placeholder="Full Name"
                      />
                      {errors.FullName && (
                        <p className="text-red-400 text-sm mt-1">
                          {errors.FullName}
                        </p>
                      )}
                    </div>
                    <div>
                      <input
                        type="email"
                        name="Email"
                        value={form.Email}
                        onChange={handleChange}
                        disabled={loading}
                        className="w-full px-4 py-3 rounded-lg bg-[#18191c] text-white focus:ring-2 focus:ring-blue-500 placeholder-gray-500 border-none"
                        placeholder="Email Address"
                      />
                      {errors.Email && (
                        <p className="text-red-400 text-sm mt-1">
                          {errors.Email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm_custom:grid-cols-2 md:grid-cols-1 gap-4">
                    <input
                      type="tel"
                      name="Phone"
                      value={form.Phone}
                      onChange={handleChange}
                      disabled={loading}
                      className="w-full px-4 py-3 rounded-lg bg-[#18191c] text-white focus:ring-2 focus:ring-blue-500 placeholder-gray-500 border-none"
                      placeholder="Phone Number"
                    />

                    <input
                      type="tel"
                      name="AadharNo"
                      value={form.AadharNo}
                      onChange={handleChange}
                      disabled={loading}
                      className="w-full px-4 py-3 rounded-lg bg-[#18191c] text-white focus:ring-2 focus:ring-blue-500 placeholder-gray-500 border-none"
                      placeholder="Aadhar Number"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm_custom:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="Password"
                      value={form.Password}
                      onChange={handleChange}
                      disabled={loading}
                      className="w-full px-4 py-3 rounded-lg bg-[#18191c] text-white focus:ring-2 focus:ring-blue-500 placeholder-gray-500 border-none"
                      placeholder="Password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.Password && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.Password}
                    </p>
                  )}
                </div>
                <div className="flex flex-col">
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="ConfirmPassword"
                      value={form.ConfirmPassword}
                      onChange={handleChange}
                      disabled={loading}
                      className="w-full px-4 py-3 rounded-lg bg-[#18191c] text-white focus:ring-2 focus:ring-blue-500 placeholder-gray-500 border-none"
                      placeholder="Confirm Password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.ConfirmPassword && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.ConfirmPassword}
                    </p>
                  )}
                </div>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                name="profilePic"
                accept="image/*"
                onChange={handleChange}
                disabled={loading}
                className="hidden"
              />
              <input
                type="file"
                ref={aadharInputRef}
                name="aadharImg"
                accept="image/*"
                onChange={handleChange}
                disabled={loading}
                className="hidden"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-600 shadow-lg mt-4 disabled:opacity-50"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>
          </div>

          {/* Right: Branding/Graphic */}
          <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-gradient-to-br from-[#10121A] to-[#232323] relative">
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
    </div>
  );
};

export default SignUpForm;
