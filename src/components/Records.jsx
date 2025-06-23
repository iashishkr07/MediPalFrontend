import React, { useState, useEffect } from "react";
import {
  Table,
  Card,
  Tag,
  Button,
  Space,
  Spin,
  message,
  Modal,
  Descriptions,
} from "antd";
import {
  FileTextOutlined,
  EyeOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import API from "../api";

const Records = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userAadharNo, setUserAadharNo] = useState(null);
  const [viewRecord, setViewRecord] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    fetchUserAndRecords();
  }, []);

  const fetchUserAndRecords = async () => {
    try {
      setLoading(true);

      // First, fetch user information to get AadharNo
      const userResponse = await API.get("/me");
      if (userResponse.data.success) {
        const aadharNo = userResponse.data.user.AadharNo;
        setUserAadharNo(aadharNo);

        // Then fetch medical records using the AadharNo
        if (aadharNo) {
          const recordsResponse = await API.get(`/all-report/${aadharNo}`);
          if (recordsResponse.data.success) {
            setRecords(recordsResponse.data.data || []);
            message.success(
              `Found ${recordsResponse.data.data?.length || 0} medical records`
            );
          } else {
            message.error("Failed to fetch medical records");
          }
        } else {
          message.warning("Aadhar number not found for user");
        }
      } else {
        message.error("Failed to fetch user information");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      if (error.response?.status === 401) {
        message.error("Please login again to view your records");
      } else {
        message.error("Failed to fetch data. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleView = (record) => {
    setViewRecord(record);
    setIsViewOpen(true);
  };

  const handleDownload = (file) => {
    try {
      // Create a download link for the file
      const link = document.createElement("a");
      link.href = `http://localhost:7000/uploads/${file.filename}`;
      link.download = file.originalName || file.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      message.success("Download started");
    } catch (error) {
      message.error("Failed to download file");
    }
  };

  const getReportTypeDisplay = (type) => {
    const types = {
      bloodTest: "Blood Test",
      xray: "X-Ray",
      mri: "MRI Scan",
      other: "Other",
    };
    return types[type] || type;
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "reportDate",
      key: "reportDate",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
      sorter: (a, b) => new Date(a.reportDate) - new Date(b.reportDate),
    },
    {
      title: "Type",
      dataIndex: "reportType",
      key: "reportType",
      render: (type) => getReportTypeDisplay(type),
      filters: [
        { text: "Blood Test", value: "bloodTest" },
        { text: "X-Ray", value: "xray" },
        { text: "MRI Scan", value: "mri" },
        { text: "Other", value: "other" },
      ],
      onFilter: (value, record) => record.reportType === value,
    },
    {
      title: "Doctor",
      dataIndex: "doctorName",
      key: "doctorName",
    },
    {
      title: "Notes",
      dataIndex: "notes",
      key: "notes",
      render: (notes) => notes || "No notes",
      ellipsis: true,
    },
    {
      title: "Files",
      key: "files",
      render: (_, record) => (
        <div className="flex flex-col gap-2">
          {record.files && record.files.length > 0 ? (
            record.files.map((file, index) => (
              <div key={index} className="flex items-center gap-3 flex-wrap">
                <span className="truncate max-w-xs text-blue-700 font-medium">
                  {file.originalName || file.filename}
                </span>
                <Button
                  icon={<EyeOutlined />}
                  type="primary"
                  ghost
                  size="small"
                  onClick={() => handleDownload(file)}
                  className="ml-2"
                >
                  View
                </Button>
              </div>
            ))
          ) : (
            <span>No files</span>
          )}
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            type="primary"
            ghost
            onClick={() => handleView(record)}
          >
            View
          </Button>
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="p-4 sm:p-6 md:p-8 flex justify-center items-center min-h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div
      className={`p-2 sm:p-4 md:p-8 transparent-bg transition-all duration-700 ${
        isMounted ? "fade-in-up" : ""
      }`}
    >
      <Card
        title={
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 justify-between items-start sm:items-center transparent-bg">
            <span className="text-lg sm:text-xl md:text-2xl">
              Medical Records
            </span>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchUserAndRecords}
              loading={loading}
              className="transparent-bg mt-2 sm:mt-0"
            >
              Refresh
            </Button>
          </div>
        }
        className="shadow-sm transparent-bg"
      >
        <div className="mb-4 flex flex-col sm:flex-row gap-2 sm:gap-4">
          <Button
            type="primary"
            icon={<FileTextOutlined />}
            className="transparent-bg w-full sm:w-auto"
          >
            Add New Record
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table
            columns={columns}
            dataSource={records}
            rowKey="_id"
            pagination={{ pageSize: 10 }}
            loading={loading}
            className="transparent-bg min-w-[600px]"
            locale={{
              emptyText: (
                <span className="transparent-bg">
                  No medical records found. Upload your first report to get
                  started!
                </span>
              ),
            }}
          />
        </div>
      </Card>
      <Modal
        open={isViewOpen}
        title={
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-300 text-white px-4 sm:px-6 py-3 rounded-t-lg transparent-bg">
            <FileTextOutlined className="text-xl sm:text-2xl" />
            <span className="font-semibold text-base sm:text-lg">
              Report Details
            </span>
          </div>
        }
        onCancel={() => setIsViewOpen(false)}
        footer={null}
        style={{
          border: "2px solid #222",
          boxShadow: "0 0 24px #111",
          maxWidth: "95vw",
          width: "100%",
          padding: 0,
        }}
        className="rounded-xl overflow-hidden shadow-2xl transparent-modal transparent-bg max-w-full"
        styles={{
          body: { padding: 0 },
          mask: { background: "rgba(0,0,0,0.7)" },
        }}
        width="100%"
      >
        {viewRecord && (
          <div className="rounded-b-xl p-2 sm:p-4 md:p-6 transparent-bg max-h-[80vh] overflow-y-auto">
            <Descriptions
              column={1}
              bordered
              size="middle"
              labelStyle={{
                fontWeight: 600,
                background: "rgba(34,34,34,0.7)",
                color: "#f3f3f3",
                fontSize: "0.95rem",
                padding: "0.5rem 0.75rem",
              }}
              contentStyle={{
                background: "rgba(34,34,34,0.4)",
                color: "#f3f3f3",
                fontSize: "0.95rem",
                padding: "0.5rem 0.75rem",
              }}
              className="mb-4 sm:mb-6 transparent-bg"
            >
              <Descriptions.Item label="Date">
                {dayjs(viewRecord.reportDate).format("DD/MM/YYYY")}
              </Descriptions.Item>
              <Descriptions.Item label="Type">
                {getReportTypeDisplay(viewRecord.reportType)}
              </Descriptions.Item>
              <Descriptions.Item label="Doctor">
                {viewRecord.doctorName}
              </Descriptions.Item>
              <Descriptions.Item label="Notes">
                {viewRecord.notes || "No notes"}
              </Descriptions.Item>
            </Descriptions>
            <div className="mt-4 sm:mt-6">
              <strong className="text-sm sm:text-base transparent-bg">
                Files:
              </strong>
              <div className="flex flex-wrap gap-2 sm:gap-4 mt-2 sm:mt-3">
                {viewRecord.files && viewRecord.files.length > 0 ? (
                  viewRecord.files.map((file, idx) => {
                    const isImage = /\.(jpg|jpeg|png|gif)$/i.test(
                      file.filename
                    );
                    const fileUrl = `http://localhost:7000/uploads/${file.filename}`;
                    return isImage ? (
                      <div
                        className="relative group w-24 h-24 sm:w-36 sm:h-36"
                        key={idx}
                      >
                        <img
                          src={fileUrl}
                          alt={file.originalName || file.filename}
                          className="w-full h-full object-cover rounded-2xl border-4 border-gray-800 bg-gradient-to-br from-blue-200 via-cyan-100 to-blue-100 shadow-xl transition-all duration-300 hover:scale-110 hover:rotate-2 hover:border-blue-400 hover:shadow-2xl relative cursor-pointer"
                          onClick={() => window.open(fileUrl, "_blank")}
                          title="Click to view full image"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-2xl flex items-center justify-center transition-all duration-300 pointer-events-none">
                          <EyeOutlined className="text-white text-2xl sm:text-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      </div>
                    ) : (
                      <a
                        key={idx}
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-2 py-1 sm:px-4 sm:py-2 rounded-lg font-medium shadow hover:bg-blue-600 transition-colors duration-150 border border-gray-700 transparent-bg text-xs sm:text-base"
                      >
                        <FileTextOutlined className="mr-1 sm:mr-2" />
                        {file.originalName || file.filename}
                      </a>
                    );
                  })
                ) : (
                  <span>No files</span>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Records;
