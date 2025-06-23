import axios from "axios";

const doctorApi = axios.create({
  baseURL: "https://medipalbackend.onrender.com/api",
});

doctorApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("doctorToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default doctorApi;
