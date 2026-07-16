import React, { useEffect, useState } from "react";
import { Container, Spinner, Badge, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import {
    deletePost,
    getPostById,
    addLikeToPost,
    addCommentToPost,
} from "../../api/postApi";
import {
    formatDateTime,
    getCurrentUser,
    isPostOwner,
} from "../../utils/common";
import CommentSection from "../../components/CommentSection";

const PostDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const currentUser = getCurrentUser();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [savingComment, setSavingComment] = useState(false);
    const [liking, setLiking] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const data = await getPostById(id);
                setPost(data);
            } catch (error) {
                console.error("Failed to load post:", error);
                setPost(null);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [id]);

    const isOwner = isPostOwner(post?.userId, currentUser);

    const handleDelete = async () => {
        // eslint-disable-next-line no-restricted-globals
        const ok = window.confirm("Delete this post?");
        if (!ok) return;

        try {
            setDeleting(true);
            const updated = await deletePost(id, currentUser.id);
            // notify lists so they can remove the deleted post immediately
            if (typeof window !== "undefined" && window.dispatchEvent) {
                window.dispatchEvent(
                    new CustomEvent("post-deleted", { detail: updated }),
                );
            }
            navigate("/my-posts");
        } finally {
            setDeleting(false);
        }
    };

    const handleEdit = () => {
        navigate(`/edit-post/${id}`);
    };

    const hasLiked = () => {
        return post?.likedBy?.some(
            (userId) => String(userId) === String(currentUser?.id),
        );
    };

    const handleLike = async () => {
        if (!currentUser) {
            alert("Please login to like this post.");
            return;
        }

        try {
            setLiking(true);
            const currentLikes = Array.isArray(post?.likedBy)
                ? post.likedBy
                : [];
            const likedBy = hasLiked()
                ? currentLikes.filter(
                      (userId) => String(userId) !== String(currentUser.id),
                  )
                : [...currentLikes, currentUser.id];

            const updated = await addLikeToPost(id, likedBy);
            setPost(updated);
        } catch (error) {
            console.error("Failed to update like status:", error);
            alert("Không thể cập nhật lượt thích. Vui lòng thử lại.");
        } finally {
            setLiking(false);
        }
    };

    const updateCommentTree = (comments, commentId, updater) => {
        return comments.map((comment) => {
            if (String(comment.id) === String(commentId)) {
                return updater(comment);
            }

            if (Array.isArray(comment.replies) && comment.replies.length > 0) {
                return {
                    ...comment,
                    replies: updateCommentTree(
                        comment.replies,
                        commentId,
                        updater,
                    ),
                };
            }

            return comment;
        });
    };

    const removeCommentTree = (comments, commentId) => {
        return comments
            .filter((comment) => String(comment.id) !== String(commentId))
            .map((comment) => ({
                ...comment,
                replies: Array.isArray(comment.replies)
                    ? removeCommentTree(comment.replies, commentId)
                    : [],
            }));
    };

    const addReplyToTree = (comments, parentId, reply) => {
        return comments.map((comment) => {
            if (String(comment.id) === String(parentId)) {
                return {
                    ...comment,
                    replies: Array.isArray(comment.replies)
                        ? [...comment.replies, reply]
                        : [reply],
                };
            }

            if (Array.isArray(comment.replies) && comment.replies.length > 0) {
                return {
                    ...comment,
                    replies: addReplyToTree(comment.replies, parentId, reply),
                };
            }

            return comment;
        });
    };

    const handleLikeComment = async (commentId) => {
        if (!currentUser) {
            alert("Please login to like this comment.");
            return;
        }

        try {
            const currentComments = Array.isArray(post.comments)
                ? post.comments
                : [];
            const updatedComments = updateCommentTree(
                currentComments,
                commentId,
                (comment) => {
                    const likes = Array.isArray(comment.likedBy)
                        ? comment.likedBy
                        : [];
                    const hasLiked = likes.some(
                        (userId) => String(userId) === String(currentUser.id),
                    );

                    return {
                        ...comment,
                        likedBy: hasLiked
                            ? likes.filter(
                                  (userId) =>
                                      String(userId) !== String(currentUser.id),
                              )
                            : [...likes, currentUser.id],
                    };
                },
            );

            const updated = await addCommentToPost(id, updatedComments);
            setPost(updated);
        } catch (error) {
            console.error("Failed to like comment:", error);
            alert("Cannot update comment like. Please try again.");
        }
    };

    const handleReplyComment = async (parentId, replyTextValue) => {
        if (!currentUser) {
            alert("Please login to reply.");
            return;
        }

        const reply = {
            id: `${Date.now()}`,
            userId: currentUser.id,
            username: currentUser.username || currentUser.email,
            content: replyTextValue.trim(),
            createdAt: new Date().toISOString(),
            likedBy: [],
            replies: [],
        };

        try {
            const currentComments = Array.isArray(post.comments)
                ? post.comments
                : [];
            const updatedComments = addReplyToTree(
                currentComments,
                parentId,
                reply,
            );
            const updated = await addCommentToPost(id, updatedComments);
            setPost(updated);
        } catch (error) {
            console.error("Failed to reply to comment:", error);
            alert("Cannot add reply. Please try again.");
        }
    };

    const handleUpdateComment = async (commentId, newContent) => {
        if (!currentUser) {
            alert("Please login to edit comments.");
            return;
        }

        try {
            const currentComments = Array.isArray(post.comments)
                ? post.comments
                : [];
            const updatedComments = updateCommentTree(
                currentComments,
                commentId,
                (comment) => ({
                    ...comment,
                    content: newContent,
                }),
            );

            const updated = await addCommentToPost(id, updatedComments);
            setPost(updated);
        } catch (error) {
            console.error("Failed to update comment:", error);
            alert("Cannot update comment. Please try again.");
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            const currentComments = Array.isArray(post.comments)
                ? post.comments
                : [];
            const updatedComments = removeCommentTree(
                currentComments,
                commentId,
            );
            const updated = await addCommentToPost(id, updatedComments);
            setPost(updated);
        } catch (error) {
            console.error("Failed to delete comment:", error);
            alert("Cannot delete comment. Please try again.");
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();

        if (!currentUser) {
            alert("Please login to comment.");
            return;
        }

        if (!commentText.trim()) {
            return;
        }

        try {
            setSavingComment(true);
            const comments = Array.isArray(post?.comments)
                ? [
                      ...post.comments,
                      {
                          id: `${Date.now()}`,
                          userId: currentUser.id,
                          username: currentUser.username || currentUser.email,
                          content: commentText.trim(),
                          createdAt: new Date().toISOString(),
                          likedBy: [],
                          replies: [],
                      },
                  ]
                : [
                      {
                          id: `${Date.now()}`,
                          userId: currentUser.id,
                          username: currentUser.username || currentUser.email,
                          content: commentText.trim(),
                          createdAt: new Date().toISOString(),
                          likedBy: [],
                          replies: [],
                      },
                  ];

            const updated = await addCommentToPost(id, comments);
            setPost(updated);
            setCommentText("");
        } catch (error) {
            console.error("Failed to add comment:", error);
            alert("Cannot add comment. Please try again.");
        } finally {
            setSavingComment(false);
        }
    };

    if (loading) {
        return (
            <Container className="mt-5 text-center">
                <Spinner animation="border" />
            </Container>
        );
    }

    if (!post) {
        return (
            <Container className="mt-4">
                <h4>Post not found</h4>
            </Container>
        );
    }

    return (
        <Container className="mt-4" style={{ maxWidth: "900px" }}>
            {/* ===== HEADER ===== */}
            <div className="mb-3">
                <div className="d-flex align-items-center justify-content-between">
                    {/* TITLE */}
                    <div>
                        <h2 className="mb-1 fw-bold">{post.title}</h2>

                        <div
                            className="small"
                            style={{
                                color: "var(--text-muted)",
                                lineHeight: "1.5",
                            }}
                        >
                            Created: {formatDateTime(post.createdAt)}
                            {" • "}
                            {post.updatedAt && (
                                <>
                                    Updated:{" "}
                                    {new Date(post.updatedAt).toLocaleString()}
                                </>
                            )}
                        </div>
                    </div>

                    {/* BADGE */}
                    <Badge
                        bg={post.isPublic ? "success" : "secondary"}
                        className="px-3 py-2"
                    >
                        {post.isPublic ? "Public" : "Private"}
                    </Badge>
                </div>
            </div>

            <hr />

            {/* ===== CONTENT ===== */}
            <div
                style={{
                    fontSize: "18px",
                    lineHeight: "1.8",
                    whiteSpace: "pre-wrap",
                }}
            >
                {post.content}
            </div>

            {/* ===== ACTION BAR ===== */}
            <div className="mt-4 d-flex align-items-center gap-3">
                <button
                    type="button"
                    className={`reaction-pill ${hasLiked() ? "active" : ""} ${
                        !currentUser ? "disabled" : ""
                    }`}
                    onClick={handleLike}
                    disabled={liking || !currentUser}
                >
                    <span className="icon">
                        {hasLiked() ? <FaHeart /> : <FaRegHeart />}
                    </span>
                    <span>{post.likedBy?.length || 0}</span>
                </button>
            </div>

            {isOwner && (
                <div className="mt-3 d-flex gap-2">
                    <Button variant="outline-warning" onClick={handleEdit}>
                        Edit Post
                    </Button>

                    <Button
                        variant="outline-danger"
                        disabled={deleting}
                        onClick={handleDelete}
                    >
                        {deleting ? "Deleting..." : "Delete Post"}
                    </Button>
                </div>
            )}

            <CommentSection
                post={post}
                currentUser={currentUser}
                commentText={commentText}
                setCommentText={setCommentText}
                savingComment={savingComment}
                onAddComment={handleAddComment}
                onLikeComment={handleLikeComment}
                onReplyComment={handleReplyComment}
                onUpdateComment={handleUpdateComment}
                onDeleteComment={handleDeleteComment}
            />
        </Container>
    );
};

export default PostDetail;
