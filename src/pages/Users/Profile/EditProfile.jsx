import React, { useEffect, useState } from "react";
import { Form, Button, Container, Card, Alert, Image } from "react-bootstrap";
import api from "../../../api/apiClient";
import { useNavigate } from "react-router-dom";
import { getGenders } from "../../../api/userApi";

const EditProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [genders, setGenders] = useState([]);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    image: "",
    genderId: "1",
  });

  useEffect(() => {
    const fetchUserAndGender = async () => {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (userInfo) {
        setUser(userInfo);
        setFormData({
          name: userInfo.name,
          email: userInfo.email,
          image: userInfo.image,
          genderId: userInfo.genderId?.toString() || "1",
        });
      }

      try {
        const res = await getGenders();
        setGenders(res.data);
      } catch (err) {
        console.error("Lỗi khi tải danh sách giới tính:", err);
      }
    };

    fetchUserAndGender();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image" && files?.length > 0) {
      const file = files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          image: reader.result,
        }));
      };

      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/users/${user.id}`, {
        ...user,
        ...formData,
        genderId: parseInt(formData.genderId),
      });

      const updatedUser = {
        ...user,
        ...formData,
        genderId: parseInt(formData.genderId),
      };
      localStorage.setItem("userInfo", JSON.stringify(updatedUser));

      setSuccess(true);
      setTimeout(() => navigate("/profile"), 1000);
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
    }
  };

  if (!user) return <p>Bạn chưa đăng nhập.</p>;

  return (
    <Container className="mt-4">
      <Card style={{ maxWidth: "550px", margin: "auto" }}>
        <Card.Body>
          <Card.Title className="mb-3 text-center">
            Chỉnh sửa thông tin cá nhân
          </Card.Title>

          {success && <Alert variant="success">Cập nhật thành công!</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3 text-center">
              {formData.image && (
                <Image
                  src={formData.image}
                  roundedCircle
                  width="100"
                  height="100"
                  alt="Avatar"
                />
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Ảnh đại diện (chọn tệp)</Form.Label>
              <Form.Control
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Họ tên</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

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
              <Form.Label>Giới tính</Form.Label>
              <Form.Select
                name="genderId"
                value={formData.genderId}
                onChange={handleChange}
              >
                {genders.map((gender) => (
                  <option key={gender.id} value={gender.id}>
                    {gender.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* ✅ Nút đổi mật khẩu mới */}
            <Button
              variant="outline-secondary"
              className="w-100 mb-3"
              onClick={() => navigate("/change-password")}
            >
              🔒 Change Password
            </Button>
            <Button variant="primary" type="submit" className="w-100">
              Update
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EditProfile;
