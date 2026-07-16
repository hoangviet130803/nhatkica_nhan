import React, { useState } from "react";
import { Button, Card, Container, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

import { isLogin } from "../../api/clientApi";
import { isEmail, isPhoneNumber } from "../../utils/common";

const Login = () => {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({});

    const navigate = useNavigate();

    const handleSubmitForm = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError({});

        const newErr = {};

        const loginValue = login.trim();
        const passwordValue = password.trim();

        // Validate Login (Email hoặc Phone)
        if (loginValue === "") {
            newErr.login = "Vui lòng nhập email hoặc số điện thoại";
        } else if (loginValue.includes("@")) {
            if (!isEmail(loginValue)) {
                newErr.login = "Email không đúng định dạng";
            }
        } else if (!isPhoneNumber(loginValue)) {
            newErr.login = "Số điện thoại phải gồm đúng 10 chữ số";
        }

        // Validate Password
        if (passwordValue === "") {
            newErr.password = "Vui lòng nhập mật khẩu";
        } else if (passwordValue.length < 7) {
            newErr.password = "Mật khẩu phải có ít nhất 7 ký tự";
        }

        if (Object.keys(newErr).length > 0) {
            setError(newErr);
            setLoading(false);
            return;
        }

        try {
            const users = await isLogin(loginValue, passwordValue);

            if (!users || users.length === 0) {
                setError({
                    general: "Email/Số điện thoại hoặc mật khẩu không đúng",
                });
                return;
            }

            const currentUser = users[0];

            localStorage.setItem("currentUser", JSON.stringify(currentUser));

            navigate("/");
        } catch (err) {
            console.error(err);

            setError({
                general: "Có lỗi xảy ra, vui lòng thử lại.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="w-50">
            <Card className="mt-5">
                <Card.Header className="bg-info">
                    <h2 className="text-center text-white">Login</h2>
                </Card.Header>

                <Card.Body>
                    <Form onSubmit={handleSubmitForm}>
                        <Form.Group className="mb-3">
                            <Form.Label>Email hoặc Số điện thoại</Form.Label>

                            <Form.Control
                                type="text"
                                placeholder="Nhập email hoặc số điện thoại"
                                value={login}
                                autoComplete="username"
                                onChange={(e) => setLogin(e.target.value)}
                                isInvalid={!!error.login}
                            />

                            <Form.Control.Feedback type="invalid">
                                {error.login}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>

                            <Form.Control
                                type="password"
                                placeholder="Nhập mật khẩu"
                                value={password}
                                autoComplete="current-password"
                                onChange={(e) => setPassword(e.target.value)}
                                isInvalid={!!error.password}
                            />

                            <Form.Control.Feedback type="invalid">
                                {error.password}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <div className="d-flex justify-content-end mb-2">
                            <span>Don't have an account?&nbsp;</span>
                            <Link
                                to="/register"
                                className="text-decoration-none"
                            >
                                Register
                            </Link>
                        </div>

                        <div className="d-flex justify-content-end mb-3">
                            <span>Forgot Password?&nbsp;</span>
                            <Link
                                to="/resetpassword"
                                className="text-decoration-none"
                            >
                                Reset Password
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            variant="success"
                            className="w-100"
                            disabled={loading}
                        >
                            {loading ? "Logging..." : "Login"}
                        </Button>
                        <div className="d-flex justify-content-center mt-3">
                            <Button
                                variant="outline-primary"
                                onClick={() => navigate("/")}
                                className="w-100"
                            >
                                ← Back to Home
                            </Button>
                        </div>
                        {error.general && (
                            <div className="text-danger text-center mt-3">
                                {error.general}
                            </div>
                        )}
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Login;
