import React, { useEffect, useState } from "react";
import { Card, Button, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  getAllPosts,
  getAllComments,
  deletePostAndRelated,
} from "../../../api/postApi";
import Header from "../../../components/Header";

const AllPostList = () => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentUser = JSON.parse(localStorage.getItem("userInfo"));
  const currentUserId = currentUser?.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postRes, commentRes] = await Promise.all([
          getAllPosts(),
          getAllComments(),
        ]);
        const sortedPosts = postRes.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setPosts(sortedPosts);
        setComments(commentRes.data);
      } catch (error) {
        console.error("❌ Lỗi khi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (postId) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa bài viết này?")) return;

    try {
      await deletePostAndRelated(postId);
      alert("✅ Bài viết đã được xóa.");
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      setComments((prev) => prev.filter((c) => c.postId !== postId));
    } catch (error) {
      console.error("❌ Xóa bài viết thất bại:", error);
      alert("Không thể xóa bài viết.");
    }
  };

  const countComments = (postId) =>
    comments.filter((c) => c.postId === postId).length;

  if (loading) return <Spinner animation="border" className="mt-5" />;

  return (
    <div className="container mt-4">
      <Header />
      <h3>📚 All post</h3>

      {currentUser && (
        <Link to="/create-post" className="btn btn-success mb-3">
          ➕ Create a post
        </Link>
      )}

      {posts.map((post) => {
        const isOwner = post.userId === currentUserId;
        if (!post.isPublic && !isOwner) return null;

        return (
          <Card key={post.id} className="mb-3 shadow-sm">
            <Card.Body>
              <Card.Title>{post.title}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                🕒{" "}
                {post.createdAt
                  ? new Date(post.createdAt).toLocaleString()
                  : "Không rõ thời gian"}
              </Card.Subtitle>
              <Card.Text>{post.content}</Card.Text>
              <p>💬 {countComments(post.id)} bình luận</p>

              <Link
                to={`/post/${post.id}`}
                className="btn btn-outline-primary btn-sm me-2"
              >
                View Detail
              </Link>

              {isOwner && (
                <>
                  <Link
                    to={`/edit-post/${post.id}`}
                    className="btn btn-outline-warning btn-sm me-2"
                  >
                    ✏️ Edit
                  </Link>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDelete(post.id)}
                  >
                    🗑️ Delete
                  </Button>
                 
                </>
              )}
            </Card.Body>
          </Card>
        );
      })}
    </div>
  );
};

export default AllPostList;
