import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useAuth0 } from "@auth0/auth0-react";

export default function NavbarMain() {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();
  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="#" style={{ height: "5%", width: "3%", backgroundColor: "#bbb", borderRadius: "50%" }}>hi</Navbar.Brand>
          <Nav className="justify-content-end">
            {/* <Nav.Link href="#login">Login/Sign Up</Nav.Link> */}
            <Nav.Link>
              {/* If not already authenticated, generate a login button. Otherwise, logout. */}
              {!isAuthenticated ? (
                <button onClick={() => loginWithRedirect()}>Log In</button>
              ) : (
                <button onClick={() => logout()}>Log Out</button>
              )}
              </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}
