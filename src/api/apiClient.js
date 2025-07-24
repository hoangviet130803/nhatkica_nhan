import axios from "axios";

const API_BASE_URL = "http://localhost:9999/";
//khởi tạo axios instance dung chung

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export default api;
