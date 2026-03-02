import React from "react";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbarContainer">
        
        {/* Logo */}
        <div className="logoNav">
          StudyPets
        </div>

        {/* Links - You can replace these */}
        <div className="navLinks">
          <a href="#">Link One</a>
          <a href="#">Link Two</a>
          <a href="#">Link Three</a>
          <a href="/login" className="navButton">Login</a>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;