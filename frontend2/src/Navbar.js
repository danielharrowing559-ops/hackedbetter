import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbarContainer">
        
        {/* Logo */}
        <Link to="/" className="logoNav">
          StudyPets
        </Link>

        {/* Links */}
        <div className="navLinks">
          <Link to='/study'>Study</Link>
          <Link to='/pets'>Pets</Link>
          <Link to='/profile'>Profile</Link>
          <Link to="/login" className="navButton">
            Login
          </Link>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;