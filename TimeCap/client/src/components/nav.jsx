import {Navbar, Nav, Container} from 'react-bootstrap'
import {Link, NavLink} from 'react-router-dom'
import { useAuth } from '../context/AuthContext';

function AppNavbar(){

    const {user, loading} = useAuth()
    if(loading) return null

    return(
        <Navbar expand="lg">
            <Container>
                {/* Hamburger icon for mobile view */}
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                {/* hides the links on mobile */}
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav>
                        <Container className="container-fluid">
                            <Nav.Link as={NavLink} to="/TestConnection">Test</Nav.Link>

                            {user ? (
                                <>
                                    <Nav.Link as={NavLink} to="/TimeCap">TimeCap</Nav.Link>
                                    {/* <span>Welcome, {user}</span> */}
                                </>
                            ) : (
                                <>
                                    <Nav.Link as={NavLink} to="/">Login</Nav.Link>
                                    <Nav.Link as={NavLink} to="/RegisterForm">Register</Nav.Link>
                                </>
                            )}
                            
                        </Container>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default AppNavbar;