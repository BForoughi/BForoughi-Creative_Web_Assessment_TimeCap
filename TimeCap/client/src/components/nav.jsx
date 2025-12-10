import React from "react";
import {Navbar, Nav, Container} from 'react-bootstrap'
import {Link, NavLink} from 'react-router-dom'

function AppNavbar(){
    return(
        <Navbar expand="lg">
            <Container>
                {/* Hamburger icon for mobile view */}
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                {/* hides the links on mobile */}
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav>
                        <Container className="container-fluid">
                            <Nav.Link as={NavLink} to="/" end>Home</Nav.Link>
                            <Nav.Link as={NavLink} to="/TestConnection.jsx">Test</Nav.Link>
                        </Container>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default AppNavbar;