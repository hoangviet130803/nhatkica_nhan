import React, { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { createPost } from "../../api/postApi";
import { getCurrentUser } from "../../utils/common";

const CreatePost = () => {
    const navigate = useNavigate();

    const user = getCurrentUser();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isPublic, setIsPublic] = useState(true);
    const [err, setErr] = useState({});
    const handleSubmit = async (e) => {
        e.preventDefault();
        let newErr = {};
        if (!title.trim()) {
            newErr.title = "Vui lòng nhập title";
        }
        if (!content.trim()) {
            newErr.content = "vui lòng nhập content";
        }
        setErr(newErr);
        if (Object.keys(newErr).length > 0) {
            setErr(newErr);
            return;
        }

        try {
            await createPost({
                userId: user.id,
                username: user.username || user.email,
                title,
                content,
                isPublic,

                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),

                likedBy: [],
                comments: [],

                // ===== Trash =====
                isDeleted: false,
                deletedAt: null,
                deletedBy: null,
            });
        } catch (error) {
            console.log(error);
        }
        navigate("/posts");
    };

    return (
        <Container className="mt-4" style={{ maxWidth: "700px" }}>
            <h2>Create Post</h2>

            <Form onSubmit={handleSubmit}>
                <Form.Control
                    className="mb-3"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    isInvalid={!!err.title}
                    // required
                />
                <Form.Control.Feedback type="invalid">
                    {" "}
                    {err.title}
                </Form.Control.Feedback>
                <Form.Control
                    as="textarea"
                    rows={5}
                    placeholder="Content"
                    className="mb-3"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    isInvalid={!!err.content}
                    // required
                />
                <Form.Control.Feedback type="invalid">
                    {" "}
                    {err.content}
                </Form.Control.Feedback>
                <Form.Check
                    label="Public"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                />

                <Button className="mt-3" type="submit">
                    Create
                </Button>
            </Form>
        </Container>
    );
};

export default CreatePost;
