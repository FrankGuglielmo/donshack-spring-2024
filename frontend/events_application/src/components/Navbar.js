import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function NavbarMain() {
  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
            <Navbar.Brand href="#" style={{ height: "5%", width: "3%", backgroundColor: "#bbb", borderRadius: "50%" }}>hi</Navbar.Brand>
          <Nav className="justify-content-end">
            <Nav.Link href="#login">Login/Sign Up</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default NavbarMain;