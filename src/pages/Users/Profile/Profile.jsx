import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, ListGroup, Spinner, Button } from "react-bootstrap";
import { getUserById } from "../../../api/authApi";
import api from "../../../api/apiClient";
import Header from "../../../components/Header";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [postCount, setPostCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [role, setRole] = useState("");
  const [gender, setGender] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (!userInfo?.id) return;

      try {
        // Lấy thông tin user
        const userRes = await getUserById(userInfo.id);
        const userData = userRes.data;
        setUser(userData);

        // Lấy role và gender
        const [roleRes, genderRes] = await Promise.all([
          api.get(`/role/${userData.roleId}`),
          api.get(`/gender/${userData.genderId}`),
        ]);
        setRole(roleRes.data.name);
        setGender(genderRes.data.name);

        // Lấy tổng số bài viết và bình luận
        const [postsRes, commentsRes] = await Promise.all([
          api.get(`/post?userId=${userData.id}`),
          api.get(`/comment?userId=${userData.id}`),
        ]);
        setPostCount(postsRes.data.length);
        setCommentCount(commentsRes.data.length);
      } catch (error) {
        console.error("Lỗi khi tải profile:", error);
      }
    };

    fetchProfile();
  }, []);

  if (!user) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ height: "60vh" }}
      >
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <>
      <Header />
      <Container className="my-5">
        <Row className="justify-content-center">
          <Col md={6}>
            <Card className="shadow-lg rounded-4 overflow-hidden">
              <Card.Img
                variant="top"
                src={user.image || "https://via.placeholder.com/150"}
                alt="User avatar"
                className="w-100"
                style={{ height: "300px", objectFit: "cover" }}
              />
              <Card.Body className="text-center">
                <h3 className="mb-0">{user.name}</h3>
                <p className="text-muted mb-2">{user.email}</p>

                <ListGroup variant="flush" className="text-start mt-4">
                  <ListGroup.Item>
                    <strong>👤 Gender:</strong> {gender}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>🔐 Role:</strong> {role}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>📝 Total Posts:</strong> {postCount}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>💬 Total Comments:</strong> {commentCount}
                  </ListGroup.Item>
                </ListGroup>

                <div className="mt-4 d-flex justify-content-center">
                  <Button href="/edit-profile" variant="primary">
                    ✏️ Edit Profile
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );

};

export default Profile;
