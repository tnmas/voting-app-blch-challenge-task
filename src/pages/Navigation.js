import React from "react";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

function Navigation() {
  return (
    
      <Navbar expand="lg" variant="light" bg="light">
        <Container>
          <Navbar.Brand href="#">OS Voting App</Navbar.Brand>
        </Container>
      </Navbar>
  );
}

export default Navigation;