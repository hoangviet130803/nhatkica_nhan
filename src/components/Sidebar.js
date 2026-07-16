import React from "react";
import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { FaHome, FaList, FaPen, FaUser, FaBook, FaTrash } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import { getCurrentUser } from "../utils/common";

const Sidebar = () => {
    const user = getCurrentUser();

    const { isDark } = useTheme();

    const menu = [
        { name: "Home", path: "/", icon: <FaHome /> },
        { name: "List Posts", path: "/posts", icon: <FaList /> },

        ...(user
            ? [
                  {
                      name: "My Posts",
                      path: "/my-posts",
                      icon: <FaBook />,
                  },
                  {
                      name: "Trash",
                      path: "/trash",
                      icon: <FaTrash />,
                  },
                  {
                      name: "Write Post",
                      path: "/create-post",
                      icon: <FaPen />,
                  },
              ]
            : []),

        { name: "Profile", path: "/profile", icon: <FaUser /> },
    ];

    return (
        <div
            style={{
                height: "100vh",
                background: isDark ? "#0f172a" : "#111827",
                color: "#fff",
                padding: "20px",
                transition: "0.3s",
            }}
        >
            <h4 className="mb-4 fw-bold text-primary text-center">
                Personal Diary
            </h4>

            <Nav className="flex-column gap-2">
                {menu.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `d-flex align-items-center gap-2 px-3 py-2 rounded text-decoration-none ${
                                isActive
                                    ? "bg-primary text-white"
                                    : "text-light"
                            }`
                        }
                    >
                        {item.icon}
                        <span>{item.name}</span>
                    </NavLink>
                ))}
            </Nav>
        </div>
    );
};

export default Sidebar;
