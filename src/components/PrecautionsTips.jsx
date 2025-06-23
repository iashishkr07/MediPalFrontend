import React, { useEffect, useState } from "react";
import { Card, Spin, Alert } from "antd";
import API from "../api";
import { generateHealthReport } from "../healthPlan";

const PrecautionsTips = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [latestRecord, setLatestRecord] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please login to view your health tips.");
          setLoading(false);
          return;
        }
        // Get user info
        const userRes = await API.get("/me");
        if (!userRes.data.success || !userRes.data.user?.AadharNo) {
          throw new Error("Failed to fetch user info or Aadhar number.");
        }
        const aadharNo = userRes.data.user.AadharNo;
        // Get latest medical record
        const recordRes = await API.get(`/medical-records/latest/${aadharNo}`);
        if (!recordRes.data.success || !recordRes.data.data) {
          throw new Error("No medical record found.");
        }
        setLatestRecord(recordRes.data.data);
      } catch (err) {
        setError(err.message || "Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-96">
        <Spin size="large" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="p-8">
        <Alert message={error} type="error" showIcon />
      </div>
    );
  }
  if (!latestRecord) {
    return (
      <div className="p-8">
        <Alert message="No medical record found." type="info" showIcon />
      </div>
    );
  }

  const healthReport = generateHealthReport(latestRecord);

  return (
    <div className="p-4 sm:p-8 max-w-full sm:max-w-6xl mx-auto">
      <h2 className="text-2xl sm:text-4xl font-extrabold mb-6 sm:mb-10 text-center text-blue-900 tracking-tight drop-shadow-lg">
        Personalized Health Plan
      </h2>
      {/* New: Health Report Card */}
      <div className="mt-6 sm:mt-10">
        <Card
          title={
            <span className="text-lg sm:text-xl font-bold text-pink-800">
              Custom Health Report
            </span>
          }
          className="shadow-lg border-0 rounded-3xl bg-pink-50 hover:shadow-2xl transition-all duration-200 p-4 sm:p-6"
          headStyle={{
            background: "#FCE7F3",
            borderRadius: "1.5rem 1.5rem 0 0",
          }}
        >
          <div className="mb-4">
            <b className="text-base sm:text-lg text-pink-700">Precautions:</b>
            <ul className="list-disc pl-6 sm:pl-8 text-sm sm:text-base mt-1 space-y-1">
              {healthReport.precautions.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="mb-4">
            <b className="text-base sm:text-lg text-pink-700">Avoid:</b>
            <ul className="list-disc pl-6 sm:pl-8 text-sm sm:text-base mt-1 space-y-1">
              {healthReport.avoid.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="mb-4">
            <b className="text-base sm:text-lg text-pink-700">
              Recommended Actions:
            </b>
            <ul className="list-disc pl-6 sm:pl-8 text-sm sm:text-base mt-1 space-y-1">
              {healthReport.actions.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <b className="text-base sm:text-lg text-pink-700">
              Medicines/Supplements:
            </b>
            <ul className="list-disc pl-6 sm:pl-8 text-sm sm:text-base mt-1 space-y-1">
              {healthReport.medicines.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </Card>
      </div>
      {/* Diet Plan Card */}
      <div className="mt-6 sm:mt-10">
        <Card
          title={
            <span className="text-lg sm:text-xl font-bold text-green-800">
              Weekly Diet Plan
            </span>
          }
          className="shadow-lg border-0 rounded-3xl bg-green-50 hover:shadow-2xl transition-all duration-200 p-4 sm:p-6"
          headStyle={{
            background: "#DCFCE7",
            borderRadius: "1.5rem 1.5rem 0 0",
          }}
        >
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm sm:text-base">
              <thead>
                <tr>
                  <th className="px-2 sm:px-4 py-2 text-left">Day</th>
                  <th className="px-2 sm:px-4 py-2 text-left">Morning</th>
                  <th className="px-2 sm:px-4 py-2 text-left">Lunch</th>
                  <th className="px-2 sm:px-4 py-2 text-left">Evening</th>
                  <th className="px-2 sm:px-4 py-2 text-left">Dinner</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(healthReport.dietPlan).map(([day, meals]) => (
                  <tr key={day} className="border-t">
                    <td className="px-2 sm:px-4 py-2 font-semibold">{day}</td>
                    <td className="px-2 sm:px-4 py-2">{meals.morning}</td>
                    <td className="px-2 sm:px-4 py-2">{meals.lunch}</td>
                    <td className="px-2 sm:px-4 py-2">{meals.evening}</td>
                    <td className="px-2 sm:px-4 py-2">{meals.dinner}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PrecautionsTips;
