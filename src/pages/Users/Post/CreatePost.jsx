import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { createNewPost, createPostHistory} from "../../../api/postApi";
import { getUserById } from "../../../api/userApi"; // dùng để xác thực user
import { toast } from "react-toastify";

const CreatePost = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    isPublic: true,
    allowComment: true,
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserInfo(parsedUser);

      // // Kiểm tra role và xác thực user
      // if (parseInt(parsedUser.roleId) === 1) {
      //   toast.warn("Admin không được phép tạo bài viết.");
      //   return navigate("/");
      // }
      


      getUserById(parsedUser.id)
        .then((res) => {
          if (!res?.data || res.data.id !== parsedUser.id) {
            toast.error("Tài khoản không hợp lệ.");
            localStorage.removeItem("userInfo");
            navigate("/login");
          }
        })
        .catch(() => {
          toast.error("Lỗi xác thực người dùng.");
          localStorage.removeItem("userInfo");
          navigate("/login");
        });
    } else {
      toast.info("Bạn cần đăng nhập để tạo bài viết.");
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim() || !formData.content.trim()) {
      setError("❌ Tiêu đề và nội dung không được để trống.");
      return;
    }

    const newPost = {
      ...formData,
      userId: String(userInfo.id),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      
    };

    try {
      setLoading(true);
      const response = await createNewPost(newPost);
      const createdPost = response?.data;

      // ✅ Ghi lại lịch sử tạo bài viết
      if (createdPost?.id) {
        const historyEntry = {
          postId: createdPost.id,
          userId: createdPost.userId,
          title: createdPost.title,
          content: createdPost.content,
          editedAt: new Date().toISOString(), 
        };
        await createPostHistory(historyEntry);
      }

      toast.success("✅ Bài viết đã được tạo!");
      navigate("/my-posts");
    } catch (err) {
      console.error(err);
      toast.error("❌ Lỗi khi tạo bài viết.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <h2 className="mb-4 text-center">📝 Tạo Bài Viết Mới</h2>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="title">
              <Form.Label>Tiêu đề</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Nhập tiêu đề bài viết"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="content">
              <Form.Label>Nội dung</Form.Label>
              <Form.Control
                as="textarea"
                name="content"
                rows={6}
                value={formData.content}
                onChange={handleChange}
                placeholder="Viết nội dung ở đây..."
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="isPublic">
              <Form.Check
                type="checkbox"
                name="isPublic"
                label="Công khai bài viết"
                checked={formData.isPublic}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="allowComment">
              <Form.Check
                type="checkbox"
                name="allowComment"
                label="Cho phép bình luận"
                checked={formData.allowComment}
                onChange={handleChange}
              />
            </Form.Group>

            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? "Đang tạo..." : "Tạo bài viết"}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default CreatePost;
