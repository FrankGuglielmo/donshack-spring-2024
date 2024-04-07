import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from "react-bootstrap/NavDropdown";
import { useAuth0 } from "@auth0/auth0-react";
import Logo from '../imgs/clixz_logo.png';

export default function NavbarMain() {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();
  return (
    <>
      <Navbar style={{ backgroundColor: '#C4D6E6' }}>
        <Container>
          <Navbar.Brand href="/">
            <img
              src={Logo}
              alt="logo"
              style={{ height: '60px'}}
            />
          </Navbar.Brand>
          <Nav className="justify-content-end">
            <NavDropdown
              className="dropdown bg-large"
              title="☰"
              id="basic-nav-dropdown"
              align="end"
              style={{ fontSize: "30px" }}
            >
              <NavDropdown.Item className="nav-item" href="/" >
                Home
              </NavDropdown.Item>
              {isAuthenticated && (
                <NavDropdown.Item className="nav-item" href="/#/profile">
                  Profile
                </NavDropdown.Item>
              )}

              {/* If not already authenticated, generate a login button. Otherwise, logout. */}
              {!isAuthenticated ? (
                <NavDropdown.Item
                  className="nav_item"
                  onClick={() => loginWithRedirect({})}
                >
                  Log In/Sign Up
                </NavDropdown.Item>
              ) : (
                <NavDropdown.Item
                  className="nav_item"
                  onClick={() => logout({})}
                >
                  Log Out
                </NavDropdown.Item>
              )}
            </NavDropdown>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}
