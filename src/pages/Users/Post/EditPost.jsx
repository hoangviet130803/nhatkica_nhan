import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getPostById,
  updatePostById,
  createPostHistory,
} from "../../../api/postApi";
import { Form, Button, Alert, Spinner, Container } from "react-bootstrap";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    isPublic: true,
    allowComment: true,
  });
  const [originalPost, setOriginalPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const storedUser = localStorage.getItem("userInfo");
  const userInfo = storedUser ? JSON.parse(storedUser) : null;
  const userId = userInfo?.id;

  useEffect(() => {
    if (!userInfo || !userId) {
      alert("⚠️ Bạn cần đăng nhập để sửa bài viết.");
      return navigate("/login");
    }

    const fetchPost = async () => {
      try {
        const res = await getPostById(id);
        const post = res.data;

        if (String(post.userId) !== String(userId)) {
          alert("🚫 Bạn không có quyền chỉnh sửa bài viết này.");
          return navigate("/my-posts");
        }

        setFormData({
          title: post.title || "",
          content: post.content || "",
          isPublic: post.isPublic ?? true,
          allowComment: post.allowComment ?? true,
        });

        setOriginalPost(post);
      } catch (err) {
        console.error("❌ Không thể tải bài viết:", err);
        setError("Không thể tải bài viết. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, []);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedTitle = formData.title.trim();
    const trimmedContent = formData.content.trim();

    if (!trimmedTitle || !trimmedContent) {
      return setError("⚠️ Tiêu đề và nội dung không được để trống.");
    }

    try {

      const isChanged =
        originalPost.title !== formData.title ||
        originalPost.content !== formData.content ||
        originalPost.isPublic !== formData.isPublic ||
        originalPost.allowComment !== formData.allowComment;
      
      if (isChanged) {
        // ✅ Ghi lại lịch sử trước khi cập nhật
        const historyEntry = {
          postId: originalPost.id,
          userId: originalPost.userId,
          title: originalPost.title,
          content: originalPost.content,
          editedAt: new Date().toISOString(),
        }
          ;
        await createPostHistory(historyEntry);
      }
      // ✅ Cập nhật bài viết
      const updatedPost = {
        ...originalPost,
        ...formData,
        updatedAt: new Date().toISOString(),
      };

      await updatePostById(id, updatedPost);
      alert("✅ Cập nhật bài viết và lưu lịch sử thành công.");
      navigate("/my-posts");
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật:", err);
      setError("Không thể cập nhật bài viết. Vui lòng thử lại.");
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
        <p className="mt-2">Đang tải bài viết...</p>
      </div>
    );
  }

  return (
    <Container className="mt-4">
      <h3>✏️ Chỉnh sửa bài viết</h3>
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
            required
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
            required
          />
        </Form.Group>

        <Form.Check
          type="checkbox"
          name="isPublic"
          label="Công khai bài viết"
          checked={formData.isPublic}
          onChange={handleChange}
          className="mb-2"
        />

        <Form.Check
          type="checkbox"
          name="allowComment"
          label="Cho phép bình luận"
          checked={formData.allowComment}
          onChange={handleChange}
          className="mb-4"
        />

        <Button variant="success" type="submit">
          💾 Lưu thay đổi
        </Button>
      </Form>
    </Container>
  );
};

export default EditPost;
