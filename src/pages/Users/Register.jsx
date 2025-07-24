// Register.jsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  CardHeader,
  CardBody,
  Form,
  Button,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { registerUser, checkUserExistence } from "../../api/authApi";
import { getGenders } from "../../api/userApi";
import '../Login/Login.css';

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState("https://via.placeholder.com/150");
  const [genderId, setGenderId] = useState(1);
  const [genders, setGenders] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchGenders = async () => {
      try {
        const response = await getGenders();
        setGenders(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách giới tính:", error);
      }
    };
    fetchGenders();
  }, []);

 
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    // Kiểm tra xem email hoặc tên đã tồn tại chưa
    const { emailExists, nameExists } = await checkUserExistence(email, name);

    if (emailExists) {
      alert("Email đã tồn tại!");
      return;
    }
    if (nameExists) {
      alert("Tên người dùng đã tồn tại!");
      return;
    }

    const newUser = {
      name,
      email,
      password,
      image,
      genderId: parseInt(genderId),
      roleId: 2, // mặc định là user
    };

    await registerUser(newUser);
    alert("Đăng ký thành công!");
    navigate("/login");
  } catch (error) {
    console.error("Lỗi đăng ký:", error);
    alert("Đăng ký thất bại. Vui lòng thử lại.");
  }
};

 
  return (
    <Container className="d-flex justify-content-center m-5 p-5">
      <Card style={{ width: "600px" }}>
        <CardHeader className="text-center bg-success text-white">
          Register
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit} className="d-flex flex-column">
            <Form.Group className="m-2" controlId="formName">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                className="input-hover-custom"
                type="text"
                value={name}
                placeholder="Enter your name"
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="m-2" controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                className="input-hover-custom"
                type="email"
                value={email}
                placeholder="Enter email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="m-2" controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                className="input-hover-custom"
                type="password"
                value={password}
                placeholder="Enter password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="m-2" controlId="formImage">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                className="input-hover-custom"
                type="text"
                value={image}
                placeholder="https://via.placeholder.com/150"
                onChange={(e) => setImage(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="m-2" controlId="formGender">
              <Form.Label>Gender</Form.Label>
              <Form.Select
                className="input-hover-custom"
                value={genderId}
                onChange={(e) => setGenderId(e.target.value)}
              >
                {genders.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Button
              type="submit"
              className="btn btn-success  custom-hover-button m-2"
              style={{ borderRadius: "50px" }}
            >
              Register
            </Button>
          </Form>
        </CardBody>
      </Card>
    </Container>
  );
};

export default Register;
