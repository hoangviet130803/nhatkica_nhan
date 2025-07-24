import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  getPostById,
  getAllComments,
  createComment,
  deleteCommentById,
  updateCommentById,
  createPostHistory,
} from "../../../api/postApi";
import { getUserById } from "../../../api/userApi";
import {
  getLikesByCommentId,
  hasUserLikedComment,
  likeComment,
  unlikeComment,
} from "../../../api/likeApi";

import { Card, Spinner, Alert, Form, Button, Image } from "react-bootstrap";
import { FaTrash, FaThumbsUp } from "react-icons/fa";
import Header from "../../../components/Header";

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [postUser, setPostUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [likes, setLikes] = useState({});
  const [likedStatus, setLikedStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editCommentId, setEditCommentId] = useState(null);
  const [editContent, setEditContent] = useState("");

  const currentUser = useMemo(() => {
    return JSON.parse(localStorage.getItem("userInfo"));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postRes, allComments] = await Promise.all([
          getPostById(id),
          getAllComments(),
        ]);
        const foundPost = postRes.data;

        if (!foundPost.isPublic && currentUser?.id !== foundPost.userId) {
          setError("⛔ Bài viết này không công khai.");
          return;
        }

        setPost(foundPost);
        const postUserRes = await getUserById(foundPost.userId);
        setPostUser(postUserRes.data);

        const filteredComments = allComments.data.filter(
          (c) => String(c.postId) === id
        );

        const enriched = await Promise.all(
          filteredComments.map(async (c) => {
            const u = c.userId ? await getUserById(c.userId) : null;
            const likes = await getLikesByCommentId(c.id);
            const liked = currentUser
              ? await hasUserLikedComment(c.id, currentUser.id)
              : false;

            return {
              ...c,
              userName: u?.data?.name || "Ẩn danh",
              avatar: u?.data?.image || "",
              likeCount: likes.length,
              liked,
            };
          })
        );

        const likeMap = {}, likeStatusMap = {};
        enriched.forEach((c) => {
          likeMap[c.id] = c.likeCount;
          likeStatusMap[c.id] = c.liked;
        });

        setComments(enriched);
        setLikes(likeMap);
        setLikedStatus(likeStatusMap);
      } catch (err) {
        console.error("❌ Lỗi:", err);
        setError("Không tìm thấy bài viết.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, currentUser]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return alert("Bạn cần đăng nhập để bình luận.");
    if (!commentInput.trim()) return alert("Nội dung không được để trống.");

    try {
      const now = new Date().toISOString();
      const newComment = {
        postId: id,
        userId: currentUser.id,
        content: commentInput.trim(),
        createdAt: now,
        updatedAt: new Date().toISOString(),
        
      };

      const res = await createComment(newComment);

      
//
      const resUser = await getUserById(currentUser.id);
if (currentUser.id !== post.userId){
  await createPostHistory({
    type: "comment",
    postId: id,
    commentId: res.data.id,
    userId: currentUser.id,
    content: commentInput.trim(),
    updatedAt: now,
  });
}
      setComments((prev) => [
        ...prev,
        {
          ...res.data,
          userName: resUser.data.name,
          avatar: resUser.data.image,
          likeCount: 0,
          liked: false,
        },
      ]);
      setCommentInput("");
    } catch (err) {
      console.error("❌ Lỗi khi tạo bình luận:", err);
      alert("Không thể tạo bình luận.");
    }
  };

  const handleLikeToggle = async (commentId) => {
    if (!currentUser) return alert("Bạn cần đăng nhập để like.");

    try {
      const alreadyLiked = likedStatus[commentId];
      if (alreadyLiked) {
        await unlikeComment(commentId, currentUser.id);
        setLikes((prev) => ({ ...prev, [commentId]: Math.max((prev[commentId] || 1) - 1, 0) }));
        setLikedStatus((prev) => ({ ...prev, [commentId]: false }));
      } else {
        await likeComment(commentId, currentUser.id);
        setLikes((prev) => ({ ...prev, [commentId]: (prev[commentId] || 0) + 1 }));
        setLikedStatus((prev) => ({ ...prev, [commentId]: true }));
      }
    } catch (err) {
      console.error("❌ Lỗi khi like/unlike:", err);
      alert("Không thể xử lý like.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Xác nhận xóa bình luận?")) return;
    try {
      await deleteCommentById(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      console.error("❌ Lỗi khi xóa bình luận:", err);
      alert("Xóa thất bại.");
    }
  };

  const handleUpdateComment = async (commentId) => {
    if (!editContent.trim()) return alert("Nội dung không được để trống.");

    try {
      const comment = comments.find((c) => c.id === commentId);
      await updateCommentById(commentId, {
        ...comment,
        content: editContent,
        updatedAt: new Date().toISOString(),
      });

      await createPostHistory({
        type: "comment",
        postId: id,
        commentId,
        userId: currentUser.id,
        content: comment.content,
        updatedAt: comment.updatedAt || comment.createdAt,
      });

      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId ? { ...c, content: editContent, updatedAt: new Date().toISOString() } : c
        )
      );
      setEditCommentId(null);
      setEditContent("");
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật bình luận:", err);
      alert("Không thể cập nhật bình luận.");
    }
  };

  if (loading) return <Spinner animation="border" className="mt-5" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="container mt-4">
      <Header />
      <Card>
        <Card.Body>
          {postUser && (
            <div className="d-flex align-items-center mb-3">
              <Image src={postUser.image} roundedCircle style={{ width: 50, height: 50, marginRight: 10 }} />
              <div>
                <strong>{postUser.name}</strong>
                <div className="text-muted" style={{ fontSize: "0.8rem" }}>
                  🕒 {new Date(post.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
          )}
          <Card.Title>{post.title}</Card.Title>
          <Card.Text>{post.content}</Card.Text>
        </Card.Body>
      </Card>

      <div className="mt-4">
        <h5>💬 COMMENT ({comments.length})</h5>
        {comments.map((c) => (
          <Card key={c.id} className="mb-2">
            <Card.Body>
              <div className="d-flex align-items-center mb-2">
                <Image src={c.avatar || "https://via.placeholder.com/40"} roundedCircle style={{ width: 40, height: 40, marginRight: 10 }} />
                <div className="flex-grow-1">
                  <strong>{c.userName}</strong>
                  <div className="text-muted" style={{ fontSize: "0.8rem" }}>
                    🕒 {new Date(c.createdAt).toLocaleString()}
                  </div>
                </div>
                {(currentUser?.roleId === 1 || currentUser?.id === c.userId) && (
                  <>
                    <Button variant="warning" size="sm" className="me-2" onClick={() => { setEditCommentId(c.id); setEditContent(c.content); }}>
                      Edit
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDeleteComment(c.id)}>
                      <FaTrash />
                    </Button>
                  </>
                )}
              </div>

              {editCommentId === c.id ? (
                <>
                  <Form.Control as="textarea" rows={2} value={editContent} onChange={(e) => setEditContent(e.target.value)} className="mb-2" />
                  <div className="d-flex gap-2">
                    <Button variant="success" size="sm" onClick={() => handleUpdateComment(c.id)}>Save</Button>
                    <Button variant="secondary" size="sm" onClick={() => setEditCommentId(null)}>Cancel</Button>
                  </div>
                </>
              ) : (
                <>
                  <p>{c.content}</p>
                  <Button
                    variant={likedStatus[c.id] ? "primary" : "outline-primary"}
                    size="sm"
                    onClick={() => handleLikeToggle(c.id)}
                  >
                    <FaThumbsUp className="me-1" />
                    {likes[c.id] || 0}
                  </Button>
                </>
              )}
            </Card.Body>
          </Card>
        ))}

        {post.allowComment && (
          <Form onSubmit={handleCommentSubmit} className="mt-3">
            <Form.Group controlId="commentInput">
              <Form.Label>Comments</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
              />
            </Form.Group>
            <Button type="submit" className="mt-2" disabled={!currentUser}>
              Send
            </Button>
          </Form>
        )}
      </div>
    </div>
  );
};

export default PostDetail;