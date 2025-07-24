import React, { useEffect, useState } from "react";
import { Col, Container, Row, Button, Image} from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { getUserById } from "../api/authApi";


const Header = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [userImage, setUserImage] = useState("/images/default-avatar.png");

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    setUserName("");
    setUserImage("/images/default-avatar.png");
    navigate("/login");
  };

  const isLoggedIn = !!localStorage.getItem("userInfo");

  useEffect(() => {
    const userInfoStr = localStorage.getItem("userInfo");
    if (!userInfoStr) return;

    try {
      const userInfo = JSON.parse(userInfoStr);
      const userId = Number(userInfo?.id);
      if (!userId) return;

      const fetchUserName = async () => {
        try {
          const response = await getUserById(userId);
          const user = response.data; // ✅ FIXED

          console.log("📦 API trả về:", response.data);
          setUserName(user.name || user.email);
          setUserImage(user.image || "/images/default-avatar.png");
        } catch (error) {
          if (error.response?.status === 404) {
            console.warn(
              "Không tìm thấy user, có thể ID sai hoặc chưa có user trong DB."
            );
          } else {
            console.error("❌ Lỗi khi lấy user theo ID:", error);
          }
        }
      };


      fetchUserName();
    } catch (err) {
      console.error("❌ Lỗi khi parse userInfo:", err);
    }
  }, []);

  return (
    <Container fluid className="bg-primary text-white p-4">
      <Row className="align-items-center">
        {/* Avatar */}
        <Col xs={2} className="d-flex justify-content-start">
          <Image
            src={userImage}
            roundedCircle
            alt="User Avatar"
            style={{ width: "50px", height: "50px" }}
          />
        </Col>

        {/* Title */}
        <Col xs={7} className="d-flex justify-content-center gap-3">
          <h3 className="mb-0">📔 Personal Diary</h3>
          <Link to="/" className="nav-link ms-3">
            Home
          </Link>
          <Link to="/profile" className="nav-link">
            👤 Profile
          </Link>

          {/* Nếu là admin roleId==1 thì hiện dashboard, nếu user roleId==2 thì ẩn */}
          {(() => {
            const userInfoStr = localStorage.getItem("userInfo");
            if (userInfoStr) {
              try {
                const userInfo = JSON.parse(userInfoStr);
                if (userInfo.roleId === 1) {
                  return (
                    <Link to="/admin/dashboard" className="nav-link">
                      <i className="fa fa-dashboard" aria-hidden="true"></i>{" "}
                      Dashboard
                    </Link>
                  );
                }
              } catch (err) {
                // ignore parse error
              }
            }
            return null;
          })()}
          <Link to="/my-posts" className="nav-link">
            My diary
          </Link>
          <Link to="/my-history" className="nav-link">
            My History
          </Link>
        </Col>
        <Col xs={3} className="d-flex justify-content-end align-items-center">
          {isLoggedIn ? (
            <>
              <span className="me-3">Hello, {userName}!</span>
              <Button variant="light" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Button variant="light" onClick={handleLogin}>
              Login
            </Button>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Header;
