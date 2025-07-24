import AllPostList from "../pages/Users/Post/AllPostList";
import { Row, Col } from "react-bootstrap";

const Home = () => {
  return (
    <div>
      <Row>
        <Col
          xs={12}
          md={12}
          className="d-flex justify-content-center align-items-center  "
        >
          <AllPostList />
        </Col>
      </Row>
    </div>
  );
};

export default Home;
