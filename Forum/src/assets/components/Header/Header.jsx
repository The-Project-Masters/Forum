import './Header.css';
import { useContext } from 'react';
import UserContext from '../../providers/user.context';
import { Link } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import { userRoles } from '../../common/user-roles';

const Header = ({ loading, appState, userRole }) => {
  const { user } = useContext(UserContext);

  const toggleSideNav = async (e) => {
    e.preventDefault();

    const navBar = document.querySelector('.side-nav');

    if (navBar.style.marginLeft === '-25%') {
      navBar.style.marginLeft = '0%';
    } else {
      navBar.style.marginLeft = '-25%';
    }
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="p-2">
      <Navbar.Brand as={Link} to="/">
        {<img src="./src/assets/images/logo-main.png" alt="BG-Tatko logo" width="170px"></img>}
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
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

              {/*Checks if the user is admin*/}
              {appState.userData.role === userRoles.ADMIN && (
                <>
                  <Nav.Link as={Link} to="/admin">
                    Admin
                  </Nav.Link>
                </>
              )}

              {appState.user === null ? (
                <>
                  <Nav.Link onClick={toggleSideNav}>Register</Nav.Link>
                  <Nav.Link onClick={toggleSideNav}>Login</Nav.Link>
                </>
              ) : (
                <>
                  {appState.user !== null ? (
                    <>
                      <Nav.Link as={Link} to="/myProfile">
                        My Profile
                      </Nav.Link>
                      <Nav.Link onClick={toggleSideNav}>Logout</Nav.Link>
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
