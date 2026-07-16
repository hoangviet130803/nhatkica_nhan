import React, { useRef, useState } from "react";
import {
    Alert,
    Button,
    Col,
    Container,
    Form,
    Image,
    InputGroup,
    Row,
} from "react-bootstrap";
import { Navigate, useNavigate } from "react-router-dom";
import { getUserByEmail, getUserByPhone, updateUser } from "../../api/userApi";
import {
    DEFAULT_AVATAR,
    getCurrentUser,
    isEmail,
    isPhoneNumber,
} from "../../utils/common";
import ChangePassword from "./ChangePassword";

const EditProfile = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    // Lấy người dùng đang đăng nhập
    const currentUser = getCurrentUser();

    // Thông tin cá nhân
    const [form, setForm] = useState(() => ({
        username: currentUser?.username || "",
        email: currentUser?.email || "",
        phoneNumber: currentUser?.phoneNumber || "",
        avatar: currentUser?.avatar || DEFAULT_AVATAR,
    }));

    // Loading
    const [loading, setLoading] = useState(false);

    // Thông báo lỗi
    const [error, setError] = useState({});

    // Thông báo thành công
    const [success, setSuccess] = useState("");
    // Nếu chưa đăng nhập
    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    // Thay đổi thông tin
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    // Preview avatar
    const handleAvatarChange = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        // Preview ảnh
        const reader = new FileReader();
        reader.onloadend = () => {
            setForm((prev) => ({
                ...prev,
                avatar: reader.result, // base64
            }));
        };

        reader.readAsDataURL(file);
    };

    const handleRemoveAvatar = async () => {
        try {
            const updatedUser = {
                ...currentUser,
                avatar: DEFAULT_AVATAR,
            };

            await updateUser(currentUser.id, updatedUser);

            localStorage.setItem("currentUser", JSON.stringify(updatedUser));

            setForm((prev) => ({
                ...prev,
                avatar: DEFAULT_AVATAR,
            }));

            if (fileInputRef.current) {
                fileInputRef.current.value = null;
            }

            setSuccess("Đã xóa ảnh đại diện.");
        } catch (err) {
            setError({
                general: "Không thể xóa ảnh.",
            });
        }
    };

    // Reset toàn bộ lỗi
    const resetError = () => {
        setError({});
        setSuccess("");
    };
    // ====================== HANDLE SUBMIT ======================
    const handleSubmit = async (e) => {
        e.preventDefault();

        resetError();
        setLoading(true);

        const newErr = {};

        // ================= Validate Username =================
        if (!form.username.trim()) {
            newErr.username = "Username không được để trống";
        }

        // ================= Validate Email =================
        if (!form.email.trim()) {
            newErr.email = "Email không được để trống";
        } else if (!isEmail(form.email)) {
            newErr.email = "Email không đúng định dạng";
        }

        // ================= Validate Phone =================
        if (!isPhoneNumber(form.phoneNumber)) {
            newErr.phoneNumber = "Số điện thoại phải gồm đúng 10 chữ số";
        }

        // Có lỗi validate
        if (Object.keys(newErr).length > 0) {
            setError(newErr);
            setLoading(false);
            return;
        }

        try {
            // ================= Check Email =================
            const emailRes = await getUserByEmail(form.email);

            const emailExist = emailRes.find(
                (user) =>
                    user.email === form.email && user.id !== currentUser.id,
            );

            if (emailExist) {
                setError({
                    email: "Email đã được sử dụng.",
                });
                setLoading(false);
                return;
            }

            // ================= Check Phone =================
            const phoneRes = await getUserByPhone(form.phoneNumber);

            const phoneExist = phoneRes.find(
                (user) =>
                    user.phoneNumber === form.phoneNumber &&
                    user.id !== currentUser.id,
            );

            if (phoneExist) {
                setError({
                    phoneNumber: "Số điện thoại đã tồn tại.",
                });
                setLoading(false);
                return;
            }

            // ================= Tạo user mới =================
            const updatedUser = {
                ...currentUser,
                username: form.username,
                email: form.email,
                phoneNumber: form.phoneNumber,
                avatar: form.avatar,
            };

            // ================= Update DB =================
            await updateUser(currentUser.id, updatedUser);

            // ================= Update LocalStorage =================
            localStorage.setItem("currentUser", JSON.stringify(updatedUser));

            // ================= Success =================
            setSuccess("Cập nhật thông tin thành công!");

            setTimeout(() => {
                navigate("/profile");
            }, 1500);
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
        <Container
            className="mt-4 mb-5 p-3"
            style={{
                maxWidth: "800px",
                background: "var(--bg)",
                color: "var(--text)",
                borderRadius: "12px",
            }}
        >
            <h2 className="mb-4 text-center">Edit Profile</h2>
            {success && <Alert variant="success">{success}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={4}>
                        <div
                            className="text-center p-3"
                            style={{
                                background: "var(--card)",
                                border: "1px solid var(--border)",
                                borderRadius: "12px",
                            }}
                        >
                            <Image
                                src={form.avatar || DEFAULT_AVATAR}
                                roundedCircle
                                width={180}
                                height={180}
                                style={{
                                    objectFit: "cover",
                                    border: "3px solid var(--border)",
                                }}
                            />

                            <h5
                                className="mt-3 mb-1"
                                style={{ color: "var(--text)" }}
                            >
                                {form.username}
                            </h5>

                            <Form.Control
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                hidden
                            />

                            <div className="d-grid gap-2 mt-4">
                                <Button
                                    variant="primary"
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                >
                                    Change Photo
                                </Button>

                                <Button
                                    variant="outline-danger"
                                    onClick={handleRemoveAvatar}
                                    disabled={form.avatar === DEFAULT_AVATAR}
                                >
                                    Remove Photo
                                </Button>
                            </div>
                        </div>
                    </Col>

                    <Col md={8}>
                        <Form.Group className="mb-3">
                            <Form.Label>Username</Form.Label>

                            <Form.Control
                                type="text"
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                isInvalid={!!error.username}
                                style={{
                                    background: "var(--card)",
                                    color: "var(--text)",
                                    borderColor: "var(--border)",
                                }}
                            />

                            <Form.Control.Feedback type="invalid">
                                {error.username}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>

                            <Form.Control
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                isInvalid={!!error.email}
                                style={{
                                    background: "var(--card)",
                                    color: "var(--text)",
                                    borderColor: "var(--border)",
                                }}
                            />

                            <Form.Control.Feedback type="invalid">
                                {error.email}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Phone Number</Form.Label>

                            <Form.Control
                                type="text"
                                name="phoneNumber"
                                value={form.phoneNumber}
                                onChange={handleChange}
                                isInvalid={!!error.phoneNumber}
                                style={{
                                    background: "var(--card)",
                                    color: "var(--text)",
                                    borderColor: "var(--border)",
                                }}
                            />

                            <Form.Control.Feedback type="invalid">
                                {error.phoneNumber}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>

                <hr className="my-4" />

                <h4 className="mb-3">Change Password</h4>

                {error.general && (
                    <Alert variant="danger">{error.general}</Alert>
                )}

                <div className="d-flex gap-3">
                    <Button type="submit" disabled={loading}>
                        {loading ? "Saving..." : "Save Changes"}
                    </Button>

                    <ChangePassword
                        userId={currentUser.id}
                        currentPassword={currentUser.password}
                        onSuccess={(newPass) => {
                            const updated = {
                                ...currentUser,
                                password: newPass,
                            };

                            localStorage.setItem(
                                "currentUser",
                                JSON.stringify(updated),
                            );
                        }}
                    />
                </div>
            </Form>
        </Container>
    );
};

export default EditProfile;
