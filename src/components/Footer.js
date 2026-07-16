import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="footer">
            <Container>
                <Row>
                    {/* Giới thiệu */}
                    <Col md={4} className="mb-3">
                        <h5>Personal Diary</h5>

                        <p>
                            Nơi lưu giữ suy nghĩ, cảm xúc và những khoảnh khắc
                            quan trọng trong cuộc sống của bạn.
                        </p>
                    </Col>

                    {/* Điều hướng */}
                    <Col md={4} className="mb-3 ">
                        <h5>Menu</h5>

                        <ul className="footer-list ">
                            <li>
                                <Link to="/">Home</Link>
                            </li>

                            <li>
                                <Link to="/posts">List Posts</Link>
                            </li>

                            <li>
                                <Link to="/create-post">Write Diary</Link>
                            </li>

                            <li>
                                <Link to="/profile">Profile</Link>
                            </li>
                        </ul>
                    </Col>

                    {/* Liên hệ */}
                    <Col md={4} className="mb-3">
                        <h5>Liên hệ</h5>

                        <p>
                            Email: support@diaryapp.com
                            <br />
                            Hotline: 0123 456 789
                        </p>
                    </Col>
                </Row>

                <hr />

                <div className="text-center footer-copy">
                    © {new Date().getFullYear()} Personal Diary. All rights
                    reserved.
                </div>
            </Container>
        </footer>
    );
};

export default Footer;
