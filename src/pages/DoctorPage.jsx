import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DoctorPanel from "./DoctorPanel/DoctorPanel";
import Navbar1 from "../components/Navbar1";

const DoctorPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("doctorToken");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <>
      <Navbar1 />
      <DoctorPanel />
    </>
  );
};

export default DoctorPage;
