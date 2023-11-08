// import { useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./assets/components/Header/Header";
import Footer from "./assets/components/Footer/Footer";
import About from "./assets/views/About/About";
import Home from "./assets/views/Home/Home";
import LogIn from "./assets/views/LogIn/LogIn";
import Register from "./assets/views/Register/Register";
import Posts from "./assets/views/Posts/Posts";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/register" element={<Register />} />
          <Route path="/posts" element={<Posts />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
