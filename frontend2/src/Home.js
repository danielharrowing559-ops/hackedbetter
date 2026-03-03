import React from "react";
import "./Home.css";
import Navbar from "./Navbar";

function Home() {
  return (
    <div className="home">
      <Navbar />

      {/* Background Video */}
      <div className="videoContainer">
        <video autoPlay muted loop className="backgroundVideo">
          <source src="/images/homeBg.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Overlay */}
      <div className="overlay"></div>

      {/* Floating particles */}
      <div className="particles">
        {Array.from({ length: 25 }).map((_, i) => (
          <span key={i} className="particle"></span>
        ))}
      </div>

      {/* Main Content */}
      <div className="content">
        <h1 className="logo">StudyPets</h1>
        <p className="tagline">Study hard. Earn rewards. Grow your virtual pet.</p>

        <div className="buttons">
          <button className="primaryBtn">Start Studying</button>
          <button className="secondaryBtn">Meet Your Pets</button>
        </div>
      </div>
    </div>
  );
}

export default Home;
