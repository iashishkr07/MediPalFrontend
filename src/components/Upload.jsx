import React, { useState, useEffect } from "react";
import {
  Upload,
  Card,
  Form,
  Input,
  Select,
  Button,
  ConfigProvider,
  theme,
} from "antd";
import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import { useTheme } from "../Context/ThemeContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API from "../api";
import { motion } from "framer-motion";

const { Dragger } = Upload;
const { Option } = Select;

const UploadComponent = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [AadharNo, setAadharNo] = useState(null);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please login to upload reports");
          return;
        }

        const response = await API.get("/me");

        if (response.data.success) {
          setUserId(response.data.user._id);
          setAadharNo(response.data.user.AadharNo);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        toast.error("Failed to fetch user information");
      }
    };

    fetchUser();
  }, []);

  const onFinish = async (values) => {
    try {
      if (!userId || !AadharNo) {
        toast.error("Please login to upload reports (AadharNo missing)");
        return;
      }

      setUploading(true);

      // Debug: Log AadharNo before uploading
      console.log("Uploading with AadharNo:", AadharNo);

      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("AadharNo", AadharNo);
      formData.append("reportType", values.reportType);
      formData.append("doctorName", values.doctorName);
      formData.append("reportDate", values.reportDate);
      formData.append("notes", values.notes || "");

      // Append files
      fileList.forEach((file) => {
        formData.append("files", file.originFileObj);
      });

      const response = await API.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success("Report uploaded successfully!");
        form.resetFields();
        setFileList([]);
      } else {
        toast.error(response.data.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(
        error.response?.data?.message || "Upload failed. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  const uploadProps = {
    name: "file",
    multiple: true,
    fileList,
    onChange(info) {
      setFileList(info.fileList);
    },
    beforeUpload: (file) => {
      const isPDF = file.type === "application/pdf";
      const isImage = file.type.startsWith("image/");
      if (!isPDF && !isImage) {
        toast.error("You can only upload PDF or image files!");
        return false;
      }
      return false; // Prevent auto upload
    },
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: isDarkMode
          ? {
              colorBgContainer: "#141414",
              colorBgElevated: "#1f1f1f",
              colorBorder: "#303030",
              colorText: "#ffffff",
            }
          : {
              colorBgContainer: "#ffffff",
              colorBgElevated: "#f5f5f5",
              colorBorder: "#d9d9d9",
              colorText: "#000000",
            },
      }}
    >
      <motion.div
        className={`p-8 min-h-screen`}
        style={{ background: "transparent" }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={isDarkMode ? "dark" : "light"}
        />
        <Card
          title="Upload Medical Reports"
          className="shadow-lg"
          style={{
            backgroundColor: "transparent",
            color: isDarkMode ? "#ffffff" : "#000000",
          }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className="max-w-2xl mx-auto"
          >
            <Form.Item
              name="reportType"
              label="Report Type"
              rules={[{ required: true, message: "Please enter report type" }]}
            >
              <Input
                placeholder="Enter report type"
                style={{
                  background: "transparent",
                  border: "1.5px solid #222",
                  boxShadow: "none",
                }}
              />
            </Form.Item>

            <Form.Item
              name="doctorName"
              label="Doctor's Name"
              rules={[
                { required: true, message: "Please enter doctor's name" },
              ]}
            >
              <Input
                placeholder="Enter doctor's name"
                style={{
                  background: "transparent",
                  border: "1.5px solid #222",
                  boxShadow: "none",
                }}
              />
            </Form.Item>

            <Form.Item
              name="reportDate"
              label="Report Date"
              rules={[{ required: true, message: "Please enter report date" }]}
            >
              <Input
                type="date"
                style={{
                  background: "transparent",
                  border: "1.5px solid #222",
                  boxShadow: "none",
                }}
              />
            </Form.Item>

            <Form.Item name="notes" label="Additional Notes">
              <Input.TextArea
                rows={4}
                placeholder="Enter any additional notes"
                style={{
                  background: "transparent",
                  border: "1.5px solid #222",
                  boxShadow: "none",
                }}
              />
            </Form.Item>

            <Form.Item label="Upload Files">
              <Dragger {...uploadProps}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag files to this area to upload
                </p>
                <p className="ant-upload-hint">
                  Support for PDF and image files (JPG, PNG, etc.). You can
                  upload multiple files at once.
                </p>
              </Dragger>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                icon={<UploadOutlined />}
                loading={uploading}
              >
                Upload Report
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </motion.div>
    </ConfigProvider>
  );
};

export default UploadComponent;
