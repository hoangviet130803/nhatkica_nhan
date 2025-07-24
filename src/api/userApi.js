// ===============================
// 🟩 USER APIs
// ===============================
import api from "./apiClient";
export const getUsers = () => api.get("/users");

export const getUserById = (userId) => api.get(`/users/${userId}`);

export const getGenders = () => api.get("/gender");

export const getRoles = () => api.get("/role");

export const deleteUser = (userId) => api.delete(`/users/${userId}`);
