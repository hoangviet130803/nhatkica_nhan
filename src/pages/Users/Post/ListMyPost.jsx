import React, { useEffect, useState, useMemo } from "react";
import { Button, Card, Spinner, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../../components/Header";
import {
  getPostsByUserId,
  getAllComments,
  deletePostAndRelated,
} from "../../../api/postApi";

const ListMyPost = () => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  // const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const userInfo = useMemo(() => {
      return JSON.parse(localStorage.getItem("userInfo"));
    }, []);
  
  const userId = userInfo?.id;

  useEffect(() => {
    if (!userInfo) {
      alert("Bạn cần đăng nhập để xem bài viết của mình.");
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const [postRes, commentRes] = await Promise.all([
          getPostsByUserId(userId),
          getAllComments(),
        ]);
        setPosts(postRes.data.reverse());
        setComments(commentRes.data);
      } catch (err) {
        console.error("❌ Lỗi khi tải dữ liệu:", err);
        setError("Không thể tải danh sách bài viết.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, userInfo, navigate]);

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) return;

    try {
      await deletePostAndRelated(postId);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      alert("✅ Bài viết đã được xóa.");
      setComments((prev) => prev.filter((c) => c.postId !== postId));
    } catch (err) {
      console.error("❌ Lỗi khi xóa bài viết:", err);
      alert("Không thể xóa bài viết.");
    }
  };

  const countCommentsForPost = (postId) =>
    comments.filter((c) => c.postId === postId).length;

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }


  //History
  // const handleHistory = () =>{
  //   navigate("/post-history/${post.id}");
  // }
  return (
    <div className="container mt-4">
      <Header />
      <h3>📚 My Post</h3>

      <Link to="/create-post" className="btn btn-primary mb-3">
        ➕ Create a new post
      </Link>

      {error && <Alert variant="danger">{error}</Alert>}

      {posts.length === 0 ? (
        <p>🙁 Bạn chưa có bài viết nào.</p>
      ) : (
        posts.map((post) => (
          <Card key={post.id} className="mb-3 shadow-sm">
            <Card.Body>
              <Card.Title>{post.title}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                🕒{" "}
                {post.createdAt
                  ? new Date(post.createdAt).toLocaleString("vi-VN")
                  : "Không rõ thời gian"}
              </Card.Subtitle>
              <Card.Text>{post.content}</Card.Text>

              <p>
                <strong>Trạng thái:</strong>{" "}
                {post.isPublic ? "🌐 Công khai" : "🔒 Riêng tư"} |{" "}
                {post.allowComment
                  ? "💬 Cho phép bình luận"
                  : "🚫 Không cho bình luận"}
              </p>

              <p>💬 {countCommentsForPost(post.id)} bình luận</p>

              <Link
                to={`/post/${post.id}`}
                className="btn btn-outline-primary btn-sm me-2"
              >
                View Detail
              </Link>

              <Link
                to={`/edit-post/${post.id}`}
                className="btn btn-outline-warning btn-sm me-2"
              >
                ✏️ Edit
              </Link>

              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => handleDeletePost(post.id)}
              >
                🗑️ Delete
              </Button>

              {/* <Button variant="outline-danger m-2"
                size="sm"
              onClick={() => handleHistory(post.id)}>History</Button> */}
            </Card.Body>
          </Card>
        ))
      )}
    </div>
  );
};

export default ListMyPost;
