import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useAuth0 } from "@auth0/auth0-react";
import Button from "react-bootstrap/Button";
import tempLogo from "../imgs/tempLogo.jpeg";

export default function NavbarMain() {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();
  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="/">
            <img
              src={tempLogo}
              alt="temp logo"
              style={{ height: "50px", borderRadius: "30px" }}
            />
          </Navbar.Brand>
          <Nav className="justify-content-end">
            <Nav.Link>
              {/* If not already authenticated, generate a login button. Otherwise, logout. */}
              {!isAuthenticated ? (
                <Button onClick={() => loginWithRedirect()}>Log In</Button>
              ) : (
                <Button onClick={() => logout()}>Log Out</Button>
              )}
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}
