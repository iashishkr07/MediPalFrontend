import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://medipalbackend.onrender.com/api",
  timeout: 10000, // 10 seconds timeout
});

API.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("doctorToken") ||
    localStorage.getItem("adminToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  config.headers["Content-Type"] = "application/json";
  return config;
});

// Auto logout on 401 Unauthorized
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("doctorToken");
      localStorage.removeItem("adminToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;
