import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import { Col, Container, Row } from "react-bootstrap";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
    return (
        <div>
            <Container fluid className="p-0">
                <Row className="g-0 min-vh-100">
                    {/* SIDEBAR */}
                    <Col xs={12} md={2}>
                        <div className="position-sticky top-0 vh-100">
                            <Sidebar />
                        </div>
                    </Col>

                    {/* MAIN AREA */}
                    <Col
                        xs={12}
                        md={10}
                        className="d-flex flex-column min-vh-100"
                    >
                        {/* HEADER */}
                        <Header />

                        {/* CONTENT */}
                        <div
                            className="flex-grow-1 p-4"
                            style={{
                                background: "var(--bg)",
                                transition: "0.3s",
                            }}
                        >
                            <Outlet />
                        </div>

                        {/* FOOTER */}
                        <Footer />
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default MainLayout;
