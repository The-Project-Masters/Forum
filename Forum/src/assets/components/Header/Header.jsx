import './Header.css';
import { useContext } from 'react';
import UserContext from '../../providers/user.context';
import { Link } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';

const Header = ({ loading, appState, userRole }) => {
  const { user } = useContext(UserContext);

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Brand as={Link} to="/">
        Rado & Ventsi's Forum
      </Navbar.Brand>
      {/* <Navbar.Toggle aria-controls="basic-navbar-nav" /> */}
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          {!loading ? (
            <>
              <Nav.Link as={Link} to="/home">
                Home
              </Nav.Link>
              <Nav.Link as={Link} to="/posts">
                Posts
              </Nav.Link>
              {appState.user === null ? (
                <>
                  <Nav.Link as={Link} to="/register">
                    Register
                  </Nav.Link>
                  <Nav.Link as={Link} to="/login">
                    Login
                  </Nav.Link>
                </>
              ) : (
                <>
                  {appState.userData.role >= userRole.ADMIN ? (
                    <>
                      <Nav.Link as={Link} to="/users">
                        Users
                      </Nav.Link>
                    </>
                  ) : null}
                </>
              )}
            </>
          ) : null}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
