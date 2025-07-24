import React, { useState } from "react";
import { Container, Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import api from "../../api/apiClient"; // đường dẫn tùy chỉnh theo project

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
    newPassword: "",
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const response = await api.get(`/users?email=${formData.email}`);
      const users = response.data;

      if (users.length === 0) {
        setError("Không tìm thấy tài khoản với email này.");
        setLoading(false);
        return;
      }

      const user = users[0];

      await api.put(`/users/${user.id}`, {
        ...user,
        password: formData.newPassword,
      });

      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError("Có lỗi xảy ra khi đặt lại mật khẩu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <Card style={{ maxWidth: "500px", margin: "0 auto" }}>
        <Card.Body>
          <Card.Title className="text-center mb-4">Đặt lại mật khẩu</Card.Title>

          {success && (
            <Alert variant="success">
              Mật khẩu đã được cập nhật thành công.
            </Alert>
          )}
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Mật khẩu mới</Form.Label>
              <Form.Control
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="w-100"
              disabled={loading}
            >
              {loading ? <Spinner animation="border" size="sm" /> : "Xác nhận"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ResetPassword;
