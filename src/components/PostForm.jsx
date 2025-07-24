// src/components/PostForm.jsx
import React from "react";
import { Form, Button } from "react-bootstrap";

const PostForm = ({
  title,
  setTitle,
  content,
  setContent,
  isPublic,
  setIsPublic,
  allowComment,
  setAllowComment,
  handleSubmit,
}) => {
  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Tiêu đề</Form.Label>
        <Form.Control
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Nhập tiêu đề bài viết..."
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Nội dung</Form.Label>
        <Form.Control
          as="textarea"
          rows={5}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          placeholder="Nhập nội dung bài viết..."
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Check
          type="checkbox"
          label="Công khai bài viết"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
        />
        <Form.Check
          type="checkbox"
          label="Cho phép người khác bình luận"
          checked={allowComment}
          onChange={(e) => setAllowComment(e.target.checked)}
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Đăng bài
      </Button>
    </Form>
  );
};

export default PostForm;
