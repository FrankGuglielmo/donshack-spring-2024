import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from "react-bootstrap/NavDropdown";
import { useAuth0 } from "@auth0/auth0-react";
import Logo from '../imgs/clixz_logo.png';

export default function NavbarMain() {
  const { loginWithRedirect, logout, isAuthenticated, getIdTokenClaims, isLoading } = useAuth0();
  const [userEmail, setUserEmail] = useState("");
  
  useEffect(() => {
    const fetchUserEmail = async () => {
      if (!isLoading && isAuthenticated) {
        try {
          const idTokenClaims = await getIdTokenClaims();
          setUserEmail(idTokenClaims?.email || "");
        } catch (error) {
          console.error("Error retrieving user email:", error);
        }
      }
    };
    
    fetchUserEmail();
  }, [getIdTokenClaims, isAuthenticated, isLoading]);
  return (
    <>
      <Navbar className='header'>
        <Container>
          <Navbar.Brand href="/">
            <img
              src={Logo}
              alt="logo"
              style={{ height: '60px'}}
            />
          </Navbar.Brand>
          <Nav className="justify-content-end align-items-center">
            {isAuthenticated && userEmail && (
              <span 
                className="me-3" 
                style={{ 
                  fontSize: "14px",
                  backgroundColor: "#E8EFF5",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  color: "#333",
                  fontWeight: "500",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                }}
              >
                {userEmail}
              </span>
            )}
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
