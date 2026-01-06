// Taken from react bootstrap docs, I was struggling with naming coventions so i went on youtube and found this video about BEM naming conventions - https://www.youtube.com/shorts/AJSrjaDfM0c 
// this video helped me understand how to us it: https://www.youtube.com/watch?v=SLjHSVwXYq4

import {Navbar, Nav, Container} from 'react-bootstrap'
import {NavLink} from 'react-router-dom'
import { useAuth } from '../context/AuthContext';
import "../stylesheets/Navbar.css"

// icons for nav items - all icons are taken from a free figma plugin IconScout
import homeIcon from "../assets/icons/home.png";
import messagesIcon from "../assets/icons/message.png";
import lockIcon from "../assets/icons/navLock.png";
import cameraIcon from "../assets/icons/camera.png";
import loginIcon from "../assets/icons/login.png"
import registerIcon from "../assets/icons/register.png"

function AppNavbar(){

    const {user, loading} = useAuth()
    if(loading) return null

    return(
        <Navbar expand="lg" className="app-nav mt-3 mb-3">
            <Container className="app-nav__inner pt-3 pb-3 ps-5 pe-5">
                {/* Hamburger (shows on < lg) */}
                <Navbar.Toggle aria-controls="app-navbar-nav" className="app-nav__toggle" />

                <Navbar.Collapse id="app-navbar-nav">
                    <Nav className="app-nav__links ms-auto">
                        {user ? (
                        <>
                            <Nav.Link as={NavLink} to="/TimeCap" className="app-nav__link">
                                <img className="app-nav__icon" src={homeIcon} alt="Home icon" />
                                <span className="app-nav__label">Home</span>
                            </Nav.Link>

                            <Nav.Link as={NavLink} to="/messages" className="app-nav__link">
                                <img className="app-nav__icon" src={messagesIcon} alt="Messenger icon" />
                                <span className="app-nav__label">Messages</span>
                            </Nav.Link>

                            <Nav.Link as={NavLink} to="/LockPage" className="app-nav__link">
                                <img className="app-nav__icon" src={lockIcon} alt="Padlock icon" />
                                <span className="app-nav__label">Lock</span>
                            </Nav.Link>

                            <Nav.Link as={NavLink} to="/camera" className="app-nav__link">
                                <img className="app-nav__icon" src={cameraIcon} alt="Camera icon" />
                                <span className="app-nav__label">Camera</span>
                            </Nav.Link>
                        </>
                        ) : (
                        <>
                            <Nav.Link as={NavLink} to="/LandingPage" className="app-nav__link">
                                <img className="app-nav__icon" src={homeIcon} alt="Home icon" />
                                <span className="app-nav__label">Info</span>
                            </Nav.Link>

                            <Nav.Link as={NavLink} to="/" className="app-nav__link">
                            <img className="app-nav__icon" src={loginIcon} alt="Login icon" />
                                <span className="app-nav__label">Login</span>
                            </Nav.Link>

                            <Nav.Link as={NavLink} to="/RegisterForm" className="app-nav__link">
                            <img className="app-nav__icon" src={registerIcon} alt="R symbol to represent a register icon" />
                                <span className="app-nav__label">Register</span>
                            </Nav.Link>
                        </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default AppNavbar;