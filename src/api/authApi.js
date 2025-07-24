// authApi.js
import api from "./apiClient";

// Hàm gọi API đăng nhập
export const login = ({ email, password }) =>
  api.get(`/users?email=${email}&password=${password}`);

// Hàm lấy users theo id
export const getUserById = (id) => api.get(`/users/${id}`);

// hàm lấy users theo role
export const getUsersByRole = (roleId) => api.get(`/users?roleId=${roleId}`);

export const registerUser = async (user) => {
  try {
    const response = await api.get("/users");
    const users = response.data;

    // Lọc ra các id hợp lệ (id !== "" và là số)
    const validIds = users
      .map((u) => parseInt(u.id))
      .filter((id) => !isNaN(id));

    const maxId = validIds.length > 0 ? Math.max(...validIds) : 0;
    const newId = (maxId + 1).toString(); 

    const newUser = { ...user, id: newId };

    return await api.post("/users", newUser);
  } catch (error) {
    console.error("Lỗi khi đăng ký người dùng:", error);
    throw error;
  }
};


// Hàm kiểm tra email hoặc name đã tồn tại
export const checkUserExistence = async (email, name) => {
  const response = await api.get(`/users`);
  const users = response.data;

  const emailExists = users.some((u) => u.email === email);
  const nameExists = users.some((u) => u.name === name);

  return { emailExists, nameExists };
};



// // Hàm lấy profile người dùng hiện tại (nếu backend có)
// export const getProfile = () => api.get("/users/me");
