import axios from "axios";

// const BASE_URL = "http://localhost:9999";
const BASE_URL = "https://6a856dba9c451dc67a6398db.mockapi.io/api";

const api = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
});
export default api;
