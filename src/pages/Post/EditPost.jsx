import React, { useEffect, useState } from "react";
import { Button, Container, Form, Spinner, Alert } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { getPostById, updatePost } from "../../api/postApi";
import { getCurrentUser } from "../../utils/common";

const EditPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const currentUser = getCurrentUser();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [post, setPost] = useState({
        title: "",
        content: "",
        isPublic: true,
    });

    // =========================
    // Load post
    // =========================
    useEffect(() => {
        loadPost();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadPost = async () => {
        try {
            setLoading(true);
            setError("");

            if (!currentUser) {
                alert("Please login first!");
                navigate("/login");
                return;
            }

            const data = await getPostById(id);

            if (String(data.userId) !== String(currentUser.id)) {
                alert("You don't have permission to edit this post!");
                navigate("/posts");
                return;
            }

            setPost({
                title: data.title,
                content: data.content,
                isPublic: data.isPublic,
            });
        } catch (err) {
            console.error(err);
            setError("Cannot load post data.");
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // Handle input
    // =========================
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setPost((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // =========================
    // Submit
    // =========================
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!post.title.trim() || !post.content.trim()) {
            alert("Title and Content are required!");
            return;
        }

        try {
            setSaving(true);

            await updatePost(id, {
                ...post,
                updatedAt: new Date().toISOString(),
            });

            alert("Update successfully!");

            navigate("/posts");
        } catch (err) {
            console.error(err);
            alert("Update failed!");
        } finally {
            setSaving(false);
        }
    };

    // =========================
    // Loading
    // =========================
    if (loading) {
        return (
            <Container className="mt-5 text-center">
                <Spinner animation="border" />
            </Container>
        );
    }

    // =========================
    // Error
    // =========================
    if (error) {
        return (
            <Container className="mt-4">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    // =========================
    // UI
    // =========================
    return (
        <Container className="mt-4" style={{ maxWidth: "700px" }}>
            <h2 className="mb-4 text-center">Edit Post</h2>

            <Form onSubmit={handleSubmit}>
                {/* Title */}
                <Form.Group className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        type="text"
                        name="title"
                        value={post.title}
                        onChange={handleChange}
                        placeholder="Enter title"
                    />
                </Form.Group>

                {/* Content */}
                <Form.Group className="mb-3">
                    <Form.Label>Content</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={8}
                        name="content"
                        value={post.content}
                        onChange={handleChange}
                        placeholder="Write your content..."
                    />
                </Form.Group>

                {/* Public */}
                <Form.Group className="mb-4">
                    <Form.Check
                        type="checkbox"
                        label="Public Post"
                        name="isPublic"
                        checked={post.isPublic}
                        onChange={handleChange}
                    />
                </Form.Group>

                {/* Buttons */}
                <div className="d-flex gap-2">
                    <Button type="submit" variant="primary" disabled={saving}>
                        {saving ? "Saving..." : "Save Changes"}
                    </Button>

                    <Button
                        variant="secondary"
                        onClick={() => navigate("/posts")}
                    >
                        Cancel
                    </Button>
                </div>
            </Form>
        </Container>
    );
};

export default EditPost;
