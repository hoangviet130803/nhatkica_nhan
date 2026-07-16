import React, { useEffect, useState } from "react";
import {
    Container,
    Row,
    Col,
    Image,
    Button,
    Card,
    Spinner,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getAllPosts } from "../../api/postApi";
import { getCurrentUser, getDisplayAvatar } from "../../utils/common";

const Profile = () => {
    const navigate = useNavigate();
    const currentUser = getCurrentUser();

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    // ================= LOAD POSTS =================
    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);

                const data = await getAllPosts();

                // chỉ lấy bài của user hiện tại
                const userPosts = data.filter(
                    (p) => String(p.userId) === String(currentUser.id),
                );

                setPosts(userPosts);
            } finally {
                setLoading(false);
            }
        };

        if (currentUser) load();
    }, []);

    if (!currentUser) {
        return (
            <Container className="text-center mt-5">
                <h3>Vui lòng đăng nhập!</h3>
                <Button onClick={() => navigate("/login")}>Login</Button>
            </Container>
        );
    }

    // ================= STATS =================
    const totalPosts = posts.length;
    const totalLikes = posts.reduce((s, p) => s + (p.likes || 0), 0);
    const totalViews = posts.reduce((s, p) => s + (p.views || 0), 0);

    const followers = currentUser.followers?.length || 0;
    const following = currentUser.following?.length || 0;

    // ================= LOADING =================
    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" />
            </Container>
        );
    }

    return (
        <Container
            fluid
            style={{ background: "var(--bg)", color: "var(--text)" }}
        >
            {/* COVER */}
            <div
                style={{
                    height: 180,
                    // background: "linear-gradient(135deg,#4f46e5,#06b6d4)",
                }}
            />

            <Container style={{ maxWidth: 1100 }}>
                {/* HEADER */}
                <Row className="align-items-end">
                    <Col xs="auto">
                        <Image
                            src={getDisplayAvatar(currentUser?.avatar)}
                            roundedCircle
                            style={{
                                width: 110,
                                height: 110,
                                marginTop: -50,
                                border: "3px solid white",
                            }}
                        />
                    </Col>

                    <Col>
                        <h3 className="mb-0">{currentUser.username}</h3>

                        <div style={{ color: "var(--text-muted)" }}>
                            ✉️ {currentUser.email}
                        </div>
                    </Col>

                    <Col xs="auto">
                        <Button onClick={() => navigate("/edit-profile")}>
                            Edit Profile
                        </Button>
                    </Col>
                </Row>

                {/* STATS */}
                <Row className="mt-4 g-3">
                    <Col md={2}>
                        <Card>
                            <Card.Body className="text-center">
                                <h5>{totalPosts}</h5>
                                <small>Posts</small>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* <Col md={2}>
                        <Card>
                            <Card.Body className="text-center">
                                <h5>{totalLikes}</h5>
                                <small>Likes</small>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={2}>
                        <Card>
                            <Card.Body className="text-center">
                                <h5>{totalViews}</h5>
                                <small>Views</small>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={3}>
                        <Card>
                            <Card.Body className="text-center">
                                <h5>{followers}</h5>
                                <small>Followers</small>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={3}>
                        <Card>
                            <Card.Body className="text-center">
                                <h5>{following}</h5>
                                <small>Following</small>
                            </Card.Body>
                        </Card>
                    </Col> */}
                </Row>
            </Container>
        </Container>
    );
};

export default Profile;
