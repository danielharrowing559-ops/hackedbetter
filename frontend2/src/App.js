import { Routes, Route, BrowserRouter } from "react-router-dom";
import "./App.css";
import Home from "./Home";
import Signup from "./Signup";
import Navbar from "./Navbar";
import Pets from "./Pets";
import Profile from "./Profile";
import Study from "./Study";
import { useState } from "react";

function App() {
  const [loggedin, setLoggedin] = useState(false)
  return (
    <>
    <BrowserRouter>
      <Navbar></Navbar>
      
      <Routes>
        {loggedin ? 
        <>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/pets" element={<Pets />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/study" element={<Study />} />
        </>
      :
      <Route path="*" element={<Signup />}></Route>
        }
    </Routes>

    </BrowserRouter>
    </>
  );
}

export default App;