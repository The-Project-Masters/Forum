import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './assets/config/firebase';
import { getUserData } from './assets/services/users.services';
import { userRoles } from './assets/common/user-roles';
import UserContext from './assets/providers/user.context';
import Header from './assets/components/Header/Header';
import Footer from './assets/components/Footer/Footer';
import Home from './assets/views/Home/Home';
import LogIn from './assets/views/LogIn/LogIn';
import Register from './assets/views/Register/Register';
import Posts from './assets/views/Posts/Posts';
import About from './assets/views/About/About';
import Admin from './assets/views/Admin/Admin';
import MyProfile from './assets/views/MyProfile/MyProfile';
import LogoutComponent from './assets/components/LogOut/logOut';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Container, Row } from 'react-bootstrap';

function App() {
  const [appState, setUserState] = useState({
    user: null,
    userData: { handle: null },
  });

  let [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    if (user === null) return;

    getUserData(user.uid)
      .then((snapshot) => {
        if (!snapshot.exists()) {
          throw new Error('Something went wrong!');
        }

        setUserState({
          user,
          userData: snapshot.val()[Object.keys(snapshot.val())[0]],
        });
      })
      .catch((e) => alert(e.message));
  }, [user]);

  return (
    <BrowserRouter>
      <UserContext.Provider value={{ ...appState, setContext: setUserState }}>
        <Header loading={loading} appState={appState} userRole={userRoles} />
        <Container fluid>
          <div style={{ textAlign: 'center' }}>{loading ? <p>Loading user data</p> : null}</div>
          <Row>
            <Col sm="3" xs="4" className="bg-secondary side-nav">
              <Routes>
                <Route
                  index
                  element={
                    appState.user === null ? <LogIn /> : <LogoutComponent set={setUserState} />
                  }
                />
                <Route
                  path="home"
                  element={
                    appState.user === null ? <LogIn /> : <LogoutComponent set={setUserState} />
                  }
                />
                <Route
                  path="register"
                  element={
                    appState.user === null ? <Register /> : <LogoutComponent set={setUserState} />
                  }
                />
                <Route
                  path="login"
                  element={
                    appState.user === null ? <LogIn /> : <LogoutComponent set={setUserState} />
                  }
                />
                <Route
                  path="admin"
                  element={
                    appState.user === null ? <LogIn /> : <LogoutComponent set={setUserState} />
                  }
                />
                <Route
                  path="posts"
                  element={
                    appState.user === null ? <LogIn /> : <LogoutComponent set={setUserState} />
                  }
                />
                <Route
                  path="myProfile"
                  element={
                    appState.user === null ? <LogIn /> : <LogoutComponent set={setUserState} />
                  }
                />
              </Routes>
            </Col>
            <Col className="bg-light">
              <Routes>
                <Route index element={<Home />} />
                <Route path="home" element={<Home />} />
                <Route path="posts" element={<Posts />} />
                <Route path="about" element={<About />} />
                <Route
                  path="admin"
                  element={
                    appState.userData.role === userRoles.ADMIN ? (
                      <Admin />
                    ) : (
                      "You don't have access to the admin page."
                    )
                  }
                />
                <Route
                  path="myProfile"
                  element={
                    appState.user !== null ? (
                      <MyProfile />
                    ) : (
                      'Please log in to see your profile information.'
                    )
                  }
                />
                <Route path="register" element={<Home />} />
                <Route path="login" element={<Home />} />
              </Routes>
            </Col>
          </Row>
        </Container>
        <Footer />
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default App;