import React from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import LoginForm from "./components/LoginForm";
import SignUpForm from "./components/SignUpForm";
import Navbar from "./components/Navbar";
import UserPanel from "./components/UserPanel";
import BookAppointment from "./components/BookAppointment";
import AdminLogin from "./components/DoctorLogin";
import DoctorPage from "./pages/DoctorPage";
import AdminPanel from "./pages/AdminPanel/AdminPanel";
import AnalyzeReport from "./pages/AnalyzeReport";
import AiAnalyze from "./pages/AiAnalyze";
import TextToSpeechDemo from "./pages/TextToSpeechDemo";
import DoctorLogin from "./components/DoctorLogin";

const App = () => {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="flex-1 overflow-auto">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <Home />
              </>
            }
          />
          <Route
            path="/login"
            element={
              <>
                <Navbar />
                <LoginForm />
              </>
            }
          />
          <Route path="/signup" element={<SignUpForm />} />
          <Route
            path="/dashboard"
            element={
              <>
                {/* <Navbar /> */}
                <UserPanel />
              </>
            }
          />
          <Route path="/appointments" element={<BookAppointment />} />
          <Route path="/adminlogin" element={<AdminLogin />} />
          <Route path="/doctor" element={<DoctorPage />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/analyze" element={<AnalyzeReport />} />
          <Route path="/doctor-login" element={<DoctorLogin />} />
          <Route
            path="/ai-analyze"
            element={
              <>
                <Navbar />
                <AiAnalyze />
              </>
            }
          />
          <Route
            path="/text-to-speech"
            element={
              <>
                <Navbar />
                <TextToSpeechDemo />
              </>
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default App;
