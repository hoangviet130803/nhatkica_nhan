import api from "./API";

export const isLogin = async (login, password) => {
    const isEmail = login.includes("@");

    const url = isEmail
        ? `/users?email=${login}&password=${password}`
        : `/users?phoneNumber=${login}&password=${password}`;

    const res = await api.get(url);
    return res.data;
};
