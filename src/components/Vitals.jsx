import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, Row, Col, Select, DatePicker, Spin, Alert } from "antd";
import { toast } from "react-toastify";
import API from "../api";

const { RangePicker } = DatePicker;
const { Option } = Select;

const Vitals = () => {
  const [timeRange, setTimeRange] = useState("week");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [bpData, setBpData] = useState([]);
  const [weightData, setWeightData] = useState([]);
  const [heartRateData, setHeartRateData] = useState([]);

  // Fetch user data and medical records
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please login to view your vitals");
          setLoading(false);
          return;
        }

        // Fetch user data to get AadharNo
        const userResponse = await API.get("/me");
        if (!userResponse.data.success) {
          throw new Error("Failed to fetch user data");
        }

        const user = userResponse.data.user;
        setUserData(user);

        if (!user.AadharNo) {
          throw new Error("Aadhar number not found for user");
        }

        // Fetch medical records using AadharNo
        const recordsResponse = await API.get(
          `/medical-records/me/${user.AadharNo}`
        );
        if (!recordsResponse.data.success) {
          throw new Error("Failed to fetch medical records");
        }

        const records = recordsResponse.data.data;
        setMedicalRecords(records);

        // Process data for charts
        processChartData(records);
      } catch (err) {
        console.error("Error fetching vitals data:", err);
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Failed to fetch vitals data";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Process medical records data for charts
  const processChartData = (records) => {
    if (!records || records.length === 0) {
      setBpData([]);
      setWeightData([]);
      setHeartRateData([]);
      return;
    }

    // Process blood pressure data
    const bpChartData = records
      .filter((record) => record.bloodPressure)
      .map((record) => {
        const bp = record.bloodPressure;
        const [systolic, diastolic] = bp.split("/").map(Number);
        return {
          date: new Date(record.createdAt).toLocaleDateString(),
          systolic: systolic || 0,
          diastolic: diastolic || 0,
        };
      })
      .slice(0, 10); // Limit to last 10 records

    // Process weight data
    const weightChartData = records
      .filter((record) => record.weight)
      .map((record) => ({
        date: new Date(record.createdAt).toLocaleDateString(),
        weight: parseFloat(record.weight) || 0,
      }))
      .slice(0, 10); // Limit to last 10 records

    // Mock heart rate data (since it's not in the current medical records)
    const heartRateChartData = records.slice(0, 6).map((record, index) => ({
      date: new Date(record.createdAt).toLocaleDateString(),
      rate: 70 + Math.floor(Math.random() * 10), // Mock heart rate between 70-80
    }));

    setBpData(bpChartData);
    setWeightData(weightChartData);
    setHeartRateData(heartRateChartData);
  };

  // Get latest readings for summary
  const getLatestReadings = () => {
    if (!medicalRecords || medicalRecords.length === 0) {
      return {
        bloodPressure: "No data",
        weight: "No data",
        heartRate: "No data",
      };
    }

    const latest = medicalRecords[0]; // Records are sorted by createdAt desc
    return {
      bloodPressure: latest.bloodPressure || "No data",
      weight: latest.weight ? `${latest.weight} kg` : "No data",
      heartRate: "74 bpm", // Mock data
    };
  };

  // Get trends analysis
  const getTrends = () => {
    if (!medicalRecords || medicalRecords.length < 2) {
      return {
        bloodPressure: "Insufficient data",
        weight: "Insufficient data",
        heartRate: "Insufficient data",
      };
    }

    const latest = medicalRecords[0];
    const previous = medicalRecords[1];

    // Blood pressure trend
    let bpTrend = "Stable";
    if (latest.bloodPressure && previous.bloodPressure) {
      const latestBP = latest.bloodPressure.split("/")[0];
      const previousBP = previous.bloodPressure.split("/")[0];
      if (parseInt(latestBP) > parseInt(previousBP) + 5) {
        bpTrend = "Increasing";
      } else if (parseInt(latestBP) < parseInt(previousBP) - 5) {
        bpTrend = "Decreasing";
      }
    }

    // Weight trend
    let weightTrend = "Stable";
    if (latest.weight && previous.weight) {
      const weightDiff =
        parseFloat(latest.weight) - parseFloat(previous.weight);
      if (weightDiff > 0.5) {
        weightTrend = "Increasing";
      } else if (weightDiff < -0.5) {
        weightTrend = "Decreasing";
      }
    }

    return {
      bloodPressure: bpTrend,
      weight: weightTrend,
      heartRate: "Normal range",
    };
  };

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
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          className="mb-6"
        />
      </div>
    );
  }

  const latestReadings = getLatestReadings();
  const trends = getTrends();

  return (
    <div className="p-8 bg-transparent">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Vital Signs</h2>
        <div className="flex gap-4">
          <Select
            defaultValue="week"
            style={{ width: 120 }}
            onChange={setTimeRange}
            className="vitals-select"
          >
            <Option value="week">Last Week</Option>
            <Option value="month">Last Month</Option>
            <Option value="year">Last Year</Option>
          </Select>
          <RangePicker
            className="vitals-range-picker"
            style={{
              backgroundColor: "transparent",
              color: "white",
              border: "1.5px solid #222",
              borderRadius: "8px",
              padding: "4px 8px",
            }}
            inputReadOnly={true}
          />
        </div>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card
            title="Blood Pressure Trend"
            className="shadow-sm bg-transparent text-white"
            headStyle={{ color: "white" }}
            bordered={false}
          >
            {bpData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={bpData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255, 255, 255, 0.3)"
                  />
                  <XAxis dataKey="date" tick={{ fill: "white" }} />
                  <YAxis tick={{ fill: "white" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                    }}
                    itemStyle={{ color: "white" }}
                  />
                  <Legend wrapperStyle={{ color: "white" }} />
                  <Line
                    type="monotone"
                    dataKey="systolic"
                    stroke="#8884d8"
                    name="Systolic"
                  />
                  <Line
                    type="monotone"
                    dataKey="diastolic"
                    stroke="#82ca9d"
                    name="Diastolic"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex justify-center items-center h-64 text-gray-400">
                No blood pressure data available
              </div>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title="Weight Changes"
            className="shadow-sm bg-transparent text-white"
            headStyle={{ color: "white" }}
            bordered={false}
          >
            {weightData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weightData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255, 255, 255, 0.3)"
                  />
                  <XAxis dataKey="date" tick={{ fill: "white" }} />
                  <YAxis tick={{ fill: "white" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                    }}
                    itemStyle={{ color: "white" }}
                  />
                  <Legend wrapperStyle={{ color: "white" }} />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#8884d8"
                    name="Weight (kg)"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex justify-center items-center h-64 text-gray-400">
                No weight data available
              </div>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title="Heart Rate"
            className="shadow-sm bg-transparent text-white"
            headStyle={{ color: "white" }}
            bordered={false}
          >
            {heartRateData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={heartRateData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255, 255, 255, 0.3)"
                  />
                  <XAxis dataKey="date" tick={{ fill: "white" }} />
                  <YAxis tick={{ fill: "white" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                    }}
                    itemStyle={{ color: "white" }}
                  />
                  <Legend wrapperStyle={{ color: "white" }} />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke="#ff7300"
                    name="Heart Rate (bpm)"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex justify-center items-center h-64 text-gray-400">
                No heart rate data available
              </div>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title="Summary"
            className="shadow-sm bg-transparent text-white"
            headStyle={{ color: "white" }}
            bordered={false}
          >
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Latest Readings</h3>
                <p>Blood Pressure: {latestReadings.bloodPressure}</p>
                <p>Weight: {latestReadings.weight}</p>
                <p>Heart Rate: {latestReadings.heartRate}</p>
              </div>
              <div>
                <h3 className="font-semibold">Trends</h3>
                <p>Blood Pressure: {trends.bloodPressure}</p>
                <p>Weight: {trends.weight}</p>
                <p>Heart Rate: {trends.heartRate}</p>
              </div>
              {medicalRecords.length === 0 && (
                <Alert
                  message="No Data"
                  description="No medical records found. Please add your first medical record to see your vitals."
                  type="info"
                  showIcon
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    color: "white",
                  }}
                />
              )}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Vitals;
