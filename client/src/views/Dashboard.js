import { PostContext } from "../contexts/PostContext";
import { useContext, useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Toast from "react-bootstrap/Toast";
import { AuthContext } from "../contexts/AuthContext";
import SinglePost from "../components/posts/SinglePost";
import AddPostModal from "../components/posts/AddPostModal";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import UpdatePostModal from "../components/posts/UpdatePostModal";

import addIcon from "../assets/plus-circle-fill.svg";

const Dashboard = () => {
  const {
    authState: {
      user: { username },
    },
  } = useContext(AuthContext);

  // Context
  const {
    postState: { post, posts, postLoading },
    getPosts,
    setShowAddPostModal,
    showToast: { show, message, type },
    setShowToast,
  } = useContext(PostContext);

  // Start get all posts
  useEffect(() => getPosts(), []);

  let body = null;

  if (postLoading) {
    body = (
      <div className="spinner-container">
        <Spinner animation="border" variant="info" />
      </div>
    );
  } else if (posts.length === 0) {
    body = (
      <>
        <Card className="text-center mx-5 my-5">
          <Card.Header as="h1">Hi {username} </Card.Header>
          <Card.Body>
            <Card.Title>Welcome to LearnIt</Card.Title>
            <Card.Text>
              Click the button below to track your first skill to learn
            </Card.Text>
            <Button
              variant="primary"
              onClick={setShowAddPostModal.bind(this, true)}
            >
              LearnIt!
            </Button>
          </Card.Body>
        </Card>
      </>
    );
  } else {
    body = (
      <>
        <Row
          className="row-cols-1 row-cols-md-3 g-4 mx-auto mt-3"
          style={{ marginRight: 0 }}
        >
          {posts.map((post) => (
            <Col key={post._id} className="my-2">
              <SinglePost key={post._id} post={post} />
            </Col>
          ))}
        </Row>

        {/* Open Add Post Modal */}
        {/* <OverlayTrigger
          placement="left"
          overlay={<Tooltip>Add a new thing to learn</Tooltip>}
        > */}
        <Button
          className="btn-floating"
          onClick={setShowAddPostModal.bind(this, true)}
        >
          <img src={addIcon} alt="add-post" width="60" height="60" />
        </Button>
        {/* </OverlayTrigger> */}
      </>
    );
  }

  return (
    <>
      {body}
      <AddPostModal />
      {post !== null && <UpdatePostModal />}
      {/* After post is added, show toast */}
      <Toast
        show={show}
        style={{
          position: "fixed",
          top: "20%",
          right: "10px",
          width: "max-content",
        }}
        className={`bg-${type} text-white`}
        onClose={setShowToast.bind(this, {
          show: false,
          message: "",
          type: null,
        })}
        delay={3000}
        autohide
        animation={false}
      >
        <Toast.Body>
          <strong>{message}</strong>
        </Toast.Body>
      </Toast>
    </>
  );
};

export default Dashboard;
