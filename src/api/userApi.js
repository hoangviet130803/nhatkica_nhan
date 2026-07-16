import api from "./API";

export const getAllUsers = async () => {
    const res = await api.get("/users");
    return res.data;
};

export const getUserByEmail = async (email) => {
    const res = await api.get(`/users?email=${email}`);
    return res.data;
};

export const getUserByPhone = async (phoneNumber) => {
    const res = await api.get(`/users?phoneNumber=${phoneNumber}`);
    return res.data;
};

export const getUserByLogin = async (login) => {
    const isEmail = login.includes("@");
    const url = isEmail
        ? `/users?email=${login}`
        : `/users?phoneNumber=${login}`;

    const res = await api.get(url);
    return res.data;
};

export const checkUserExists = async (email, phoneNumber) => {
    const res = await api.get(
        `/users?email=${email}&phoneNumber=${phoneNumber}`,
    );
    return res.data;
};

export const createUser = async (user) => {
    const res = await api.post("/users", user);
    return res.data;
};

export const updateUser = async (id, user) => {
    const res = await api.put(`/users/${id}`, user);
    return res.data;
};

export const updatePassword = async (id, password) => {
    const res = await api.patch(`/users/${id}`, { password });
    return res.data;
};
