import React from "react"; 
import { Navbar,Nav,Container } from 'react-bootstrap';
 import { Link } from "react-router-dom";


function NavBar() {
  return (
    <Navbar bg="dark" variant="dark">
      <Container fluid>
        <Navbar.Brand href="#home">ENfinity</Navbar.Brand>
        <Nav className="ml-auto">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/get-existing-files" className="nav-link">Data Files</Link>
        <Link to="/login" className="nav-link">Login</Link>
          {/* <Nav.Link href="#LoginPage">Login</Nav.Link> */}
        </Nav>
      </Container >
    </Navbar>
  );
}

export default NavBar;
