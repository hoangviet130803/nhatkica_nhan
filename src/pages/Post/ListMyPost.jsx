import React, { useEffect, useState } from "react";
import {
    Alert,
    Button,
    Col,
    Container,
    Image,
    Row,
    Spinner,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { getAllPosts, addLikeToPost } from "../../api/postApi";
import PostCard from "../../components/PostCard";
import {
    formatDateTime,
    getCurrentUser,
    getDisplayAvatar,
    shortenText,
} from "../../utils/common";

const ListMyPost = () => {
    const navigate = useNavigate();

    const currentUser = getCurrentUser();

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPosts = async () => {
            if (!currentUser?.id) {
                setPosts([]);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);

                const data = await getAllPosts();

                const myPosts = data.filter(
                    (post) =>
                        String(post.userId) === String(currentUser.id) &&
                        !post.isDeleted,
                );

                setPosts(myPosts);
            } catch (err) {
                console.error(err);
                setPosts([]);
            } finally {
                setLoading(false);
            }
        };

        loadPosts();
        window.addEventListener("post-deleted", handlePostDeleted);
        return () =>
            window.removeEventListener("post-deleted", handlePostDeleted);
    }, [currentUser?.id]);

    const handlePostDeleted = (e) => {
        const deleted = e?.detail;
        if (!deleted) return;
        setPosts((prev) =>
            prev.filter((p) => String(p.id) !== String(deleted.id)),
        );
    };

    const isLiked = (post) => {
        return post?.likedBy?.some(
            (userId) => String(userId) === String(currentUser?.id),
        );
    };

    const handleLike = async (post) => {
        if (!currentUser) {
            alert("Please login to like posts.");
            return;
        }

        try {
            const currentLikes = Array.isArray(post.likedBy)
                ? post.likedBy
                : [];
            const likedBy = isLiked(post)
                ? currentLikes.filter(
                      (userId) => String(userId) !== String(currentUser.id),
                  )
                : [...currentLikes, currentUser.id];

            const updatedPost = await addLikeToPost(post.id, likedBy);
            setPosts((prevPosts) =>
                prevPosts.map((p) =>
                    String(p.id) === String(post.id) ? updatedPost : p,
                ),
            );
        } catch (error) {
            console.error("Failed to update like:", error);
            alert("Không thể cập nhật like. Vui lòng thử lại.");
        }
    };

    const handleView = (id) => {
        navigate(`/posts/${id}`);
    };

    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" />
            </Container>
        );
    }

    const handleCreatePost = () => {
        navigate("/create-post");
    };
    return (
        <Container className="mt-4">
            <h3 className="mb-4 fw-bold" style={{ color: "var(--text)" }}>
                My Posts
            </h3>
            <Button onClick={() => handleCreatePost()}>Create Post</Button>
            {posts.length === 0 ? (
                <Alert variant="secondary">Bạn chưa có bài viết nào.</Alert>
            ) : (
                <Row className="g-3">
                    {posts.map((post) => (
                        <Col lg={6} key={post.id}>
                            <PostCard
                                post={post}
                                showStatus={true}
                                author={
                                    <div className="d-flex align-items-center gap-2">
                                        <Image
                                            src={getDisplayAvatar(
                                                currentUser?.avatar,
                                            )}
                                            width={40}
                                            height={40}
                                            roundedCircle
                                        />
                                        <div>
                                            <div className="fw-semibold">
                                                {currentUser.username}
                                            </div>
                                            <small
                                                style={{
                                                    color: "var(--text-muted)",
                                                }}
                                            >
                                                {formatDateTime(post.createdAt)}
                                            </small>
                                        </div>
                                    </div>
                                }
                                createdAt={post.createdAt}
                                isLiked={isLiked(post)}
                                currentUser={currentUser}
                                onLike={() => handleLike(post)}
                                onView={() => handleView(post.id)}
                                shortenText={shortenText}
                                formatDateTime={formatDateTime}
                            />
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
};

export default ListMyPost;
