import React from "react";
import { Navbar, Container } from "react-bootstrap";

const Header = () => {
  return (
    <Navbar bg="light" className="shadow-sm mb-3">
      <Container fluid>
        <Navbar.Brand className="fw-bold text-primary">
          🧭 Admin Dashboard
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
};

export default Header;
