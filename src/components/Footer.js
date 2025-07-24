import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../App.css"

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <Container>
        <Row className="align-items-center">
          <Col md={6} className="text-center text-md-start mb-2 mb-md-0">
            <small>
              &copy; {new Date().getFullYear()} Nhật ký cá nhân. All rights
              reserved.
            </small>
          </Col>
          <Col md={6} className="text-center text-md-end">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-light mx-2"
            >
              Facebook
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-light mx-2"
            >
              GitHub
            </a>
            <a href="mailto:your-email@example.com" className="text-light mx-2">
              Email
            </a>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
