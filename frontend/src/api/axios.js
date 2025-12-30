import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:9006/api/v1",
  withCredentials: true, // 🔥 cookie allow
});

export default api;
