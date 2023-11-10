// import { useState } from "react";
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import Header from './assets/components/Header/Header';
import Footer from './assets/components/Footer/Footer';
import About from './assets/views/About/About';
import Home from './assets/views/Home/Home';
import LogIn from './assets/views/LogIn/LogIn';
import Register from './assets/views/Register/Register';
import Posts from './assets/views/Posts/Posts';
import UserContext from './assets/providers/user.context';


function App() {
  //Manage user context globally
  const [userState, setUserState] = useState({
    user: null,
    userData: { handle: null },
  });

  return (
    <>
      <BrowserRouter>
        <UserContext.Provider value={{ ...userState, setContext: setUserState }}>
          <Header />
          <Routes>
            <Route path="/home" index element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<LogIn />} />
            <Route path="/register" element={<Register />} />
            <Route path="/posts" element={<Posts />} />
          </Routes>
          <Footer />
        </UserContext.Provider>
      </BrowserRouter>
    </>
  );
}

export default App;
