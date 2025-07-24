import React, { useState } from "react";
import {
  Container,
  Card,
  CardHeader,
  CardBody,
  Form,
  Button,
} from "react-bootstrap";

import { useNavigate, Link } from "react-router-dom";
import "./Login.css";
import { FaFacebookF, FaTwitter } from "react-icons/fa";
// import "react-toastify/dist/ReactToastify.css";
// import { ToastContainer, toast } from "react-toastify";

import { login } from '../../api/authApi';


const Login = () => {
 const [ email, setEmail ] = useState("");
  const [ password, setPassword ] = useState("");
  const navigate = useNavigate();

  
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await login({ email, password });
    console.log("Kết quả trả về từ API:", response.data);

    const users = response.data;

    if (users.length === 0) {
      alert("Sai email hoặc mật khẩu!");
      return;
    }

    const user = users[0]; // vì response trả về mảng các user
    console.log("Đăng nhập thành công với user ID:", user.id);

    localStorage.setItem("userInfo", JSON.stringify({ id: user.id, email: user.email, roleId: user.roleId, image: user.image, name: user.name }));
    //check roleid để điều hướng đến trang phù hợp
    switch (user.roleId) {
      case 1:
        alert(`Welcome admin ${user.name || user.email}!`);
        navigate("/");
        break;
      case 2:
        alert(`Welcome user ${user.name || user.email}!`);
        navigate("/");
        break;
      default:
        alert("Không có quyền truy cập hợp lệ!");
    }

  } catch (error) {
    console.error("❌ Lỗi khi gọi API:", error.message);
    alert("Lỗi server hoặc kết nối.");
  }
};




  //handle Register
  const handleRegister = () => {
    navigate("/register");
  };

  // Kiểm tra định dạng email
  const validateEmail = (email) => {
    // Định dạng email đơn giản
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Kiểm tra độ dài password (ít nhất 6 ký tự)
  const validatePassword = (password) => {
    return password.length >= 6;
  };
  // const notify = () => toast.success("Đăng nhập thành công!");
  return (
    <>
      {/* <div className="p-5">
                <button
                  onClick={notify}
                  className="bg-blue-500 text-white p-2 rounded"
                >
                  Hiển thị Toast
                </button>
                <ToastContainer />
              </div> */}

      <Container className="d-flex justify-content-center m-5 p-5">
        <Card className="card-login " style={{ width: "600px" }}>
          <CardHeader className="text-center bg-primary text-white">
            Login
          </CardHeader>
          <CardBody className="p-3">
            <Form onSubmit={handleSubmit} className="d-flex flex-column">
              {/* input username or email */}
              <Form.Group controlId="formUsernameEmail" className="m-2">
                <Form.Label>Enter your Email:</Form.Label>
                <Form.Control
                  className="input-hover-custom"
                  type="email"
                  value={email}
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                  isInvalid={email && !validateEmail(email)}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please enter a valid email address.
                </Form.Control.Feedback>
              </Form.Group>
              {/* input Password */}
              <Form.Group controlId="formPassword" className="m-2">
                <Form.Label>Enter your password:</Form.Label>
                <Form.Control
                  className="input-hover-custom"
                  type="password"
                  value={password}
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  isInvalid={password && !validatePassword(password)}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Password must be at least 6 characters.
                </Form.Control.Feedback>
              </Form.Group>
             
              {/* Link reset password */}
              <Form.Group className="d-flex justify-content-end">
                <Link
                  to="/resetpassword"
                  className="link-hover-custom text-decoration-none"
                  aria-label="Reset your password"
                >
                  Forgot Password ?
                </Link>
              </Form.Group>
              {/* Login button */}
              <Form.Group className="d-flex justify-content-center">
                <Button
                  type="submit"
                  // onClick={handleLogin}
                  className=" btn custom-hover-button m-2"
                  style={{
                    width: "600px",
                    height: "50px",
                    borderRadius: "50px",
                  }}
                >
                  Login
                </Button>
              </Form.Group>
              {/* form login by social-brorwser */}
              <Form.Group className="d-flex flex-column gap-3">
                <Form.Text className="d-flex justify-content-center">
                  Or Sign Up Using
                </Form.Text>
                <Form.Group className="d-flex flex-column align-items-start gap-3">
                  {/* Link login by facebook */}
                  <Link className=" d-flex justify-content-between align-items-center text-decoration-none w-100 social-link">
                    <span>Login with Facebook</span>
                    <div
                      className="rounded-circle d-flex justify-content-center align-items-center fb-icon-hover"
                      style={{
                        width: "35px",
                        height: "35px",
                        backgroundColor: "#1877F2",
                        color: "#fff",
                      }}
                    >
                      <FaFacebookF />
                    </div>
                  </Link>
                  {/* Link login by twitter */}
                  <Link className="d-flex justify-content-between align-items-center text-decoration-none w-100 social-link">
                    Login with Twitter
                    <div
                      className="rounded-circle d-flex justify-content-center align-items-center tw-icon-hover"
                      style={{
                        width: "35px",
                        height: "35px",
                        backgroundColor: "#1DA1F2",
                        color: "#fff",
                      }}
                    >
                      <FaTwitter />
                    </div>
                  </Link>
                  {/* Link Login by google */}
                  <Link className="d-flex justify-content-between align-items-center text-decoration-none w-100 social-link">
                    Login with Google
                    <div
                      className="rounded-circle d-flex justify-content-center align-items-center gg-icon-hover"
                      style={{
                        width: "35px",
                        height: "35px",
                        border: "1px solid ",
                      }}
                    >
                      <img
                        src="https://developers.google.com/identity/images/g-logo.png"
                        alt="Google logo"
                        style={{ width: "18px", height: "18px" }}
                      />
                    </div>
                  </Link>
                </Form.Group>
              </Form.Group>

              {/* Link Register  */}
              <Form.Group className="d-flex flex-column gap-3 ">
                <Form.Text className="d-flex justify-content-center ">
                  Or Sign Up Using
                </Form.Text>

                <Button
                  type="submit"
                  className="btn custom-hover-button m-2"
                  onClick={handleRegister}
                  style={{
                    width: "550px",
                    height: "50px",
                    borderRadius: "50px",
                  }}
                >
                  Sign UP
                </Button>
              </Form.Group>
            </Form>
          </CardBody>
        </Card>
      </Container>
    </>
  );
};

export default Login;
