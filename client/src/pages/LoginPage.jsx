import React from "react";
import { Row, Col, Form, InputGroup, Button } from "react-bootstrap";
import { FcGoogle } from "react-icons/fc";
import { BsLinkedin } from "react-icons/bs";

function LoginPage() {
  return (
    <div className="text-center">
      <Row>
        <Col className="mt-5 mx-2 text-center">
          <Row>
            <Col>
              <h1 className=" mt-5">Log in to</h1>
              <h3>ENfinity</h3>
              <p className="text-dark mt-4 fs-6" style={{ color: "#B5B5B5", fontFamily : 'Tai Heritage Pro, serif' }}>If you don't have an Account</p>
              <p className="text-dark my-2 fs-6" style={{ color: "#B5B5B5", fontFamily : 'Tai Heritage Pro, serif' }}>
                You can{"  "}
                <a href="/" className="link-primary">
                  {" "}
                  Register here
                </a>
              </p>
            </Col>
            <Col>
              <img
                src="images/login.png"
                className="my-5"
                style={{ height: "35vw" }}
                alt="login Icon"
              />
            </Col>
          </Row>
        </Col>
        <Col className="text-center">
          <h1 className=" mt-5">Log in</h1>
          <form action="">
            <InputGroup
              className="mb-3"
              style={{ margin: "35px auto ", width: "400px" }}
            >
              <Form.Control
                placeholder="Enter email or user name"
                aria-label="Username"
                aria-describedby="basic-addon1"
                style={{ color: "#A7A3FF", backgroundColor: "#F0EFFF" }}
                type="email"
              />
              <br />
            </InputGroup>
            <InputGroup
              className="mb-3"
              style={{ margin: " 30px auto ", width: "400px" }}
            >
              <Form.Control
                placeholder="Enter Password"
                aria-label="Password"
                aria-describedby="basic-addon1"
                style={{ color: "#A7A3FF", backgroundColor: "#F0EFFF" }}
                type="password"
              />
            </InputGroup>
            <Button
              size="lg"
              variant="primary"
              type="submit"
              className="mt-3"
              style={{ width: "400px", backgroundColor: "#4D47C3" }}
            >
              Login
            </Button>
          </form>
          <p className="text-dark my-5 fs-5" style={{ color: "#B5B5B5", fontFamily : 'Tai Heritage Pro, serif' }}>
            or continue with
          </p>

          <div className="mt-4">
            <button className="mx-2" style={{outline: 'none', border : "none", backgroundColor : "transparent"}} variant="light">
              {" "}
              <FcGoogle size="2em" />
            </button>{" "}
            <button className="mx-2" style={{outline: 'none',  border : "none" , backgroundColor : "transparent"}} variant="light">
              <BsLinkedin size="2em" color="blue" />
            </button>
          </div>
        </Col>
      </Row>
    </div>
  );
}
export default LoginPage;
