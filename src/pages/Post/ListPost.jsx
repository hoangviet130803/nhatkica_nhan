import React, { useEffect, useState } from "react";
import {
    Alert,
    Col,
    Container,
    Row,
    Spinner,
    Image,
    Form,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getAllPosts, addLikeToPost } from "../../api/postApi";
import { getAllUsers } from "../../api/userApi";
import {
    filterVisiblePosts,
    formatDateTime,
    getCurrentUser,
    getDisplayAvatar,
    isPostOwner,
    shortenText,
} from "../../utils/common";
import PostCard from "../../components/PostCard";

const ListPost = () => {
    const navigate = useNavigate();

    const currentUser = getCurrentUser();

    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState("newest");
    // ================= LOAD DATA =================
    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);

                const [postsData, usersData] = await Promise.all([
                    getAllPosts(),
                    getAllUsers(),
                ]);

                setUsers(usersData);

                const filtered = filterVisiblePosts(postsData, currentUser);

                setPosts(filtered);
            } catch (error) {
                console.error(error);
                setPosts([]);
            } finally {
                setLoading(false);
            }
        };

        load();
        window.addEventListener("post-deleted", handlePostDeleted);
        return () =>
            window.removeEventListener("post-deleted", handlePostDeleted);
    }, []);

    const handlePostDeleted = (e) => {
        const deleted = e?.detail;
        if (!deleted) return;
        setPosts((prev) =>
            prev.filter((p) => String(p.id) !== String(deleted.id)),
        );
    };

    // ================= GET AUTHOR INFO =================
    const getAuthor = (userId) => {
        return users.find((u) => String(u.id) === String(userId));
    };

    const getUsername = (userId) => {
        const user = getAuthor(userId);
        return user?.username || "Unknown user";
    };

    const isLiked = (post) => {
        return post?.likedBy?.some(
            (userId) => String(userId) === String(currentUser?.id),
        );
    };

    const handleView = (id) => {
        navigate(`/posts/${id}`);
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
            const isLiked = currentLikes.some(
                (userId) => String(userId) === String(currentUser.id),
            );
            const likedBy = isLiked
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
            console.error("Failed to update like from list:", error);
            alert("Không thể cập nhật like. Vui lòng thử lại.");
        }
    };

    const processedPosts = posts
        .filter((post) => {
            const lowerSearch = searchTerm.toLowerCase();
            const authorName = getUsername(post.userId).toLowerCase();

            const matchesSearch =
                post.title?.toLowerCase().includes(lowerSearch) ||
                post.content?.toLowerCase().includes(lowerSearch) ||
                authorName.includes(lowerSearch);

            return matchesSearch;
        })
        .sort((a, b) => {
            const dateA = new Date(a.createdAt || 0);
            const dateB = new Date(b.createdAt || 0);
            return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
        });

    // ================= LOADING =================
    if (loading) {
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" />
            </div>
        );
    }

    return (
        <Container className="mt-4">
            <h3 className="mb-4 fw-bold" style={{ color: "var(--text)" }}>
                List Posts
            </h3>
            {/* vừa tìm kiếm kết hợp sắp xeps theo ngày đc */}
            <Row className="mb-4 g-2">
                <Col md={8}>
                    <Form.Control
                        type="text"
                        placeholder="Search by text..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Col>
                <Col md={4}>
                    <Form.Select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                    </Form.Select>
                </Col>
            </Row>
            {processedPosts.length === 0 ? (
                <Alert variant="secondary">No posts available</Alert>
            ) : (
                <Row className="g-3">
                    {processedPosts.map((post) => {
                        const isOwner = isPostOwner(post.userId, currentUser);
                        const author = getAuthor(post.userId);

                        return (
                            <Col lg={6} key={post.id}>
                                <PostCard
                                    post={post}
                                    showStatus={isOwner}
                                    author={
                                        <div className="d-flex align-items-center gap-2">
                                            <Image
                                                src={getDisplayAvatar(
                                                    author?.avatar,
                                                )}
                                                width={40}
                                                height={40}
                                                roundedCircle
                                            />
                                            <div>
                                                <div className="fw-semibold">
                                                    {getUsername(post.userId)}
                                                </div>
                                                <small
                                                    style={{
                                                        color: "var(--text-muted)",
                                                    }}
                                                >
                                                    {formatDateTime(
                                                        post.createdAt,
                                                    )}
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
                        );
                    })}
                </Row>
            )}
        </Container>
    );
};

export default ListPost;
