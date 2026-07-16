import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Alert, Spinner } from "react-bootstrap";
import {
    getAllPosts,
    restorePost,
    permanentlyDeletePost,
} from "../../api/postApi";
import { getCurrentUser, formatDateTime } from "../../utils/common";
import PostCard from "../../components/PostCard";

const Trash = () => {
    // no navigation needed here
    const currentUser = getCurrentUser();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const data = await getAllPosts();
                const myDeleted = data.filter(
                    (p) =>
                        String(p.userId) === String(currentUser?.id) &&
                        p.isDeleted,
                );
                setPosts(myDeleted);
            } catch (err) {
                console.error(err);
                setPosts([]);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [currentUser?.id]);

    const handleRestore = async (postId) => {
        try {
            await restorePost(postId);
            setPosts((prev) =>
                prev.filter((p) => String(p.id) !== String(postId)),
            );
        } catch (err) {
            console.error(err);
            alert("Không thể khôi phục bài viết.");
        }
    };

    const handlePermanentDelete = async (postId) => {
        // eslint-disable-next-line no-restricted-globals
        const ok = window.confirm("Xóa vĩnh viễn bài viết này?");
        if (!ok) return;

        try {
            await permanentlyDeletePost(postId);
            setPosts((prev) =>
                prev.filter((p) => String(p.id) !== String(postId)),
            );
        } catch (err) {
            console.error(err);
            alert("Không thể xóa vĩnh viễn.");
        }
    };

    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" />
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <h3 className="mb-3">Thùng rác</h3>
            {posts.length === 0 ? (
                <Alert variant="secondary">Thùng rác trống.</Alert>
            ) : (
                <Row className="g-3">
                    {posts.map((post) => (
                        <Col lg={6} key={post.id}>
                            <PostCard
                                post={post}
                                author={<div>{post.username || "You"}</div>}
                                createdAt={post.createdAt}
                                isLiked={false}
                                currentUser={currentUser}
                                shortenText={(t) => (t || "").slice(0, 200)}
                                formatDateTime={formatDateTime}
                            />

                            <div className="mt-2 d-flex gap-2">
                                <Button
                                    variant="success"
                                    onClick={() => handleRestore(post.id)}
                                >
                                    Khôi phục
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={() =>
                                        handlePermanentDelete(post.id)
                                    }
                                >
                                    Xóa vĩnh viễn
                                </Button>
                            </div>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
};

export default Trash;
