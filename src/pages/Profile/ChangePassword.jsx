import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { updatePassword } from "../../api/userApi";

const ChangePassword = ({ userId, currentPassword, onSuccess }) => {
    const [show, setShow] = useState(false);

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        const err = {};

        if (!oldPassword) err.oldPassword = "Nhập mật khẩu cũ";
        else if (oldPassword !== currentPassword)
            err.oldPassword = "Mật khẩu cũ không đúng";

        if (!newPassword) err.newPassword = "Nhập mật khẩu mới";
        else if (newPassword.length < 7) err.newPassword = "Tối thiểu 7 ký tự";

        if (!confirmPassword) err.confirmPassword = "Xác nhận mật khẩu";
        else if (confirmPassword !== newPassword)
            err.confirmPassword = "Không khớp mật khẩu";

        if (Object.keys(err).length > 0) {
            setError(err);
            return;
        }

        try {
            setLoading(true);

            await updatePassword(userId, newPassword);

            onSuccess?.(newPassword);

            setShow(false);

            // reset form
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setError({});
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button variant="warning" onClick={() => setShow(true)}>
                Change Password
            </Button>

            <Modal show={show} onHide={() => setShow(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Change Password</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {/* Old Password */}
                    <Form.Group className="mb-3">
                        <Form.Label>Old Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            isInvalid={!!error.oldPassword}
                        />
                        <Form.Control.Feedback type="invalid">
                            {error.oldPassword}
                        </Form.Control.Feedback>
                    </Form.Group>

                    {/* New Password */}
                    <Form.Group className="mb-3">
                        <Form.Label>New Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            isInvalid={!!error.newPassword}
                        />
                        <Form.Control.Feedback type="invalid">
                            {error.newPassword}
                        </Form.Control.Feedback>
                    </Form.Group>

                    {/* Confirm Password */}
                    <Form.Group className="mb-3">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            isInvalid={!!error.confirmPassword}
                        />
                        <Form.Control.Feedback type="invalid">
                            {error.confirmPassword}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)}>
                        Cancel
                    </Button>

                    <Button
                        variant="primary"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? "Saving..." : "Save"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ChangePassword;
