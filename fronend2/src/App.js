import { Routes, Route, BrowserRouter } from "react-router-dom";
import "./App.css";
import Home from "./Home";
import Signup from "./Signup";
import Navbar from "./Navbar";
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