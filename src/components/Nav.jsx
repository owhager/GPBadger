import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav as BootstrapNav, Container, Button } from 'react-bootstrap';
import { useUser } from '../contexts/UserContext'

export default function NavBar() {
    const navigate = useNavigate();
    //grab the current user and the function to change them
    const { user, setUser } = useUser();

    const handleLogout = () => {
        setUser(null); //forget the user
        navigate('/login'); //go to login page
    };

    return (
        //top navbar with a light background and a little shadow
        <Navbar bg="light" expand="lg" className="mb-4 shadow-sm">
            <Container>
                {/* logo that links to homepage */}
                <Navbar.Brand as={Link} to="/main" className="fw-bold text-dark">
                    📚 GPBadger
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="main-navbar-nav" />
                <Navbar.Collapse id="main-navbar-nav">
                    <BootstrapNav className="ms-auto">
                        <BootstrapNav.Link as={Link} to="/main" className="fw-medium">
                            Search
                        </BootstrapNav.Link>

                        {/* if a user is logged in, show profile and logout */}
                        {user ? (
                            <>
                                <BootstrapNav.Link as={Link} to="/profile" className="fw-medium">
                                    Profile
                                </BootstrapNav.Link>
                                <Button variant="outline-dark" className="ms-3" onClick={handleLogout}>
                                    Logout
                                </Button>
                            </>
                        ) : (
                            //if no user, just show login link
                            <BootstrapNav.Link as={Link} to="/login" className="fw-medium">
                                Login
                            </BootstrapNav.Link>
                        )}
                    </BootstrapNav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
