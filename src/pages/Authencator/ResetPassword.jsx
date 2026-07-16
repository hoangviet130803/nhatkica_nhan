import React, { useState } from "react";
import { Button, Card, Container, Form } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { getUserByLogin, updatePassword } from "../../api/userApi";
import { isEmail, isPhoneNumber } from "../../utils/common";

const ResetPassword = () => {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError({});
        setLoading(true);

        const newErr = {};

        const loginValue = login.trim();
        const passwordValue = password.trim();
        const confirmValue = confirmPassword.trim();

        // validate login
        if (!loginValue) {
            newErr.login = "Vui lòng nhập email hoặc số điện thoại";
        } else if (!isEmail(loginValue) && !isPhoneNumber(loginValue)) {
            newErr.login = "Email hoặc số điện thoại không hợp lệ";
        }

        // validate password
        if (!passwordValue) {
            newErr.password = "Vui lòng nhập mật khẩu mới";
        } else if (passwordValue.length < 7) {
            newErr.password = "Mật khẩu phải >= 7 ký tự";
        }

        // confirm password
        if (passwordValue !== confirmValue) {
            newErr.confirmPassword = "Mật khẩu xác nhận không khớp";
        }

        if (Object.keys(newErr).length > 0) {
            setError(newErr);
            setLoading(false);
            return;
        }

        try {
            const res = await getUserByLogin(loginValue);

            if (res.length === 0) {
                setError({
                    login: "Tài khoản không tồn tại",
                });
                setLoading(false);
                return;
            }

            const user = res[0];

            // update password
            await updatePassword(user.id, passwordValue);

            navigate("/login");
        } catch (err) {
            console.error(err);
            setError({
                general: "Có lỗi xảy ra, vui lòng thử lại",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="w-50">
            <Card className="mt-5">
                <Card.Header className="bg-warning">
                    <h2 className="text-center">Reset Password</h2>
                </Card.Header>

                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        {/* LOGIN */}
                        <Form.Group className="mb-3">
                            <Form.Label>Email hoặc Số điện thoại</Form.Label>
                            <Form.Control
                                value={login}
                                onChange={(e) => setLogin(e.target.value)}
                                isInvalid={!!error.login}
                            />
                            <Form.Control.Feedback type="invalid">
                                {error.login}
                            </Form.Control.Feedback>
                        </Form.Group>

                        {/* NEW PASSWORD */}
                        <Form.Group className="mb-3">
                            <Form.Label>New Password</Form.Label>
                            <Form.Control
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                isInvalid={!!error.password}
                            />
                            <Form.Control.Feedback type="invalid">
                                {error.password}
                            </Form.Control.Feedback>
                        </Form.Group>

                        {/* CONFIRM */}
                        <Form.Group className="mb-3">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                type="password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                isInvalid={!!error.confirmPassword}
                            />
                            <Form.Control.Feedback type="invalid">
                                {error.confirmPassword}
                            </Form.Control.Feedback>
                        </Form.Group>

                        {/* BACK LOGIN */}
                        <div className="d-flex justify-content-end mb-3">
                            <Link to="/login">Back to Login</Link>
                        </div>

                        {/* SUBMIT */}
                        <Button
                            type="submit"
                            className="w-100"
                            disabled={loading}
                        >
                            {loading ? "Updating..." : "Reset Password"}
                        </Button>

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

export default ResetPassword;
