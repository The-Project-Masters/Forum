import { NavLink } from "react-router-dom";

export default function Header() {
  return (
    <header>
      <p>Forum App</p>
      <NavLink to="/">Home</NavLink>
      <NavLink to='/posts'>Posts</NavLink>
      <NavLink to="/about">About</NavLink>
      <NavLink to="/login">LogIn</NavLink>
      
    </header>
  );
}
