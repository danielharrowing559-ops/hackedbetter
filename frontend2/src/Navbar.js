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
          <a href="#">Link Two</a>
          <a href="#">Link Three</a>
          <Link to="/login" className="navButton">
            Login
          </Link>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;