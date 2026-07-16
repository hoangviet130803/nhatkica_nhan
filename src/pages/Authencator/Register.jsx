import React, { useState } from "react";
import { Button, Card, Container, Form } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { checkUserExists, createUser } from "../../api/userApi";
import { isEmail, isPhoneNumber } from "../../utils/common";

const Register = () => {
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        phoneNumber: "",
    });

    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError({});
        setLoading(true);

        const newErr = {};

        const { username, email, password, phoneNumber } = form;

        // username
        if (!username.trim()) {
            newErr.username = "Vui lòng nhập username";
        }

        // email
        if (!email.trim()) {
            newErr.email = "Vui lòng nhập email";
        } else if (!isEmail(email)) {
            newErr.email = "Email không hợp lệ";
        }

        // password
        if (!password.trim()) {
            newErr.password = "Vui lòng nhập password";
        } else if (password.length < 7) {
            newErr.password = "Password phải >= 7 ký tự";
        }

        // phone
        if (!phoneNumber.trim()) {
            newErr.phoneNumber = "Vui lòng nhập số điện thoại";
        } else if (!isPhoneNumber(phoneNumber)) {
            newErr.phoneNumber = "SĐT phải đúng 10 số";
        }

        if (Object.keys(newErr).length > 0) {
            setError(newErr);
            setLoading(false);
            return;
        }

        try {
            // check trùng email hoặc phone
            const existingUsers = await checkUserExists(email, phoneNumber);

            if (existingUsers.length > 0) {
                setError({
                    email: "Email hoặc SĐT đã tồn tại",
                });
                setLoading(false);
                return;
            }

            // tạo user mới
            const newUser = {
                username,
                email,
                password,
                phoneNumber,
            };

            await createUser(newUser);

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
                <Card.Header className="bg-info">
                    <h2 className="text-center text-white">Register</h2>
                </Card.Header>

                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        {/* USERNAME */}
                        <Form.Group className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                isInvalid={!!error.username}
                            />
                            <Form.Control.Feedback type="invalid">
                                {error.username}
                            </Form.Control.Feedback>
                        </Form.Group>

                        {/* EMAIL */}
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                isInvalid={!!error.email}
                            />
                            <Form.Control.Feedback type="invalid">
                                {error.email}
                            </Form.Control.Feedback>
                        </Form.Group>

                        {/* PHONE */}
                        <Form.Group className="mb-3">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control
                                name="phoneNumber"
                                value={form.phoneNumber}
                                onChange={handleChange}
                                isInvalid={!!error.phoneNumber}
                            />
                            <Form.Control.Feedback type="invalid">
                                {error.phoneNumber}
                            </Form.Control.Feedback>
                        </Form.Group>

                        {/* PASSWORD */}
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                isInvalid={!!error.password}
                            />
                            <Form.Control.Feedback type="invalid">
                                {error.password}
                            </Form.Control.Feedback>
                        </Form.Group>

                        {/* LOGIN LINK */}
                        <div className="d-flex justify-content-end mb-3">
                            Already have an account?{" "}
                            <Link to="/login">Login</Link>
                        </div>

                        {/* SUBMIT */}
                        <Button
                            type="submit"
                            className="w-100"
                            disabled={loading}
                        >
                            {loading ? "Registering..." : "Register"}
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

export default Register;
