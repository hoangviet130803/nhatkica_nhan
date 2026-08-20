import React from "react";
import { Button, Container, Image } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { getCurrentUser, getDisplayAvatar } from "../utils/common";

const Header = () => {
    const navigate = useNavigate();

    const { isDark, toggleTheme } = useTheme();

    const user = getCurrentUser();

    const isLogin = !!user;

    const handleLogout = () => {
        localStorage.removeItem("currentUser");
        navigate("/login");
    };

    return (
        <div
            style={{
                position: "sticky",
                top: 0,
                zIndex: 1000,
                background: "var(--bg-header)",
                borderBottom: "1px solid var(--border)",
            }}
        >
            <Container
                fluid
                className="d-flex align-items-center justify-content-end py-2 px-4"
            >
                {/* <div style={{ width: "40%" }}>
                    <Form.Control
                        placeholder="Search posts..."
                        style={{ borderRadius: "20px" }}
                    />
                </div> */}

                <div className="d-flex align-items-center gap-3">
                    {/* THEME TOGGLE */}
                     <Button
                        size="sm"
                        variant={isDark ? "light" : "dark"}
                        onClick={toggleTheme}
                    >
                        {isDark ? "☀️" : "🌙"}
                    </Button>

                    <Image
                        src={getDisplayAvatar(user?.avatar)}
                        roundedCircle
                        width={38}
                        height={38}
                    />

                    <div className="text-end">
                        <div
                            className="small"
                            style={{
                                color: "var(--text-muted)",
                            }}
                        >
                            Hello
                        </div>
                        <div className="fw-semibold">
                            {isLogin ? user?.username || user?.email : "Guest"}
                        </div>
                    </div>

                    {isLogin ? (
                        <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={handleLogout}
                        >
                            Logout
                        </Button>
                    ) : (
                        <Button size="sm" variant="success">
                            <Link
                                to="/login"
                                className="text-white text-decoration-none"
                            >
                                Login
                            </Link>
                        </Button>
                    )}
                </div>
            </Container>
        </div>
    );
};

export default Header;
