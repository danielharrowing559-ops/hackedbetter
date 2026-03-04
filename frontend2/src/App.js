import { Routes, Route, BrowserRouter } from "react-router-dom";
import "./App.css";
import Home from "./Home";
import Signup from "./Signup";
import Navbar from "./Navbar";
import Study from "./Study";
import Pets from "./Pets";

import { useState } from "react";

function App() {
  return (
    <>
    <BrowserRouter>
      <Navbar></Navbar>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/study" element={<Study />} />
          <Route path="/pets" element={<Pets /> } />
      <Route path="*" element={<Signup />}></Route>
    </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;