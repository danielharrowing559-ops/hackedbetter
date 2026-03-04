import { useEffect, useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login"); // "login" or "signup"

  // Common states
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [password1Show, setPassword1Show] = useState(false);
  const [password2Show, setPassword2Show] = useState(false);

  const [error, setError] = useState("");
  const [errorText, setErrorText] = useState("");

  // Signup password validation
  const [range, setRange] = useState(false);
  const [capital, setCapital] = useState(false);
  const [number, setNumber] = useState(false);
  const [special, setSpecial] = useState(false);

  // Signup function
  async function signup() {
    if (password1 === password2 && range && capital && number && special) {
      const res = await fetch("http://localhost:5000/signup", {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password1,
          email: email,
        }),
      });

      setError(res.status);
      if (res.status === 200) {
        navigate("/");
      }
    } else {
      setErrorText("Password requirements not met or passwords do not match.");
      setError(null);
    }
  }

  // Login function
  async function login() {
    const res = await fetch("http://localhost:5000/login", {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password1,
      }),
    });

    setError(res.status);
    if (res.status === 200) {
      navigate("/");
    } else {
      setErrorText("Invalid username or password.");
    }
  }

  // Password validation for signup
  useEffect(() => {
    if (password1.length > 20) {
      setPassword1(password1.slice(0, -1));
    }
    setRange(password1.length >= 7);
    setCapital(/[A-Z]/.test(password1));
    setNumber(/[0-9]/.test(password1));
    setSpecial(/[^a-zA-Z0-9]/.test(password1));
  }, [password1]);

  useEffect(() => {
    if (password2.length > 20) {
      setPassword2(password2.slice(0, -1));
    }
  }, [password2]);

  return (
    <div className="loginWrapper">
      <div className="loginContainer">
        {/* Toggle buttons */}
        <div className="toggleButtons">
          <button
            className={mode === "login" ? "activeToggle" : ""}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            className={mode === "signup" ? "activeToggle" : ""}
            onClick={() => setMode("signup")}
          >
            Sign Up
          </button>
        </div>

        {/* Validation Panel for signup */}
        {mode === "signup" && (
          <div className="validationPanel">
            {!range && <p className="errorMsg">Length range: 7 - 20</p>}
            {!capital && <p className="errorMsg">One or more capital letters</p>}
            {!number && <p className="errorMsg">One or more numbers</p>}
            {!special && <p className="errorMsg">One or more special characters</p>}
            {password1 !== password2 && <p className="errorMsg">Passwords do not match</p>}
          </div>
        )}

        <div className="formSection">
          {/* Email field only for signup */}
          {mode === "signup" && (
            <div className="inputGroup">
              <label>
                Email:
                <input
                  className="inputField"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                />
              </label>
            </div>
          )}

          <div className="inputGroup">
            <label>
              Username:
              <input
                className="inputField"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
              />
            </label>
          </div>

          <div className="inputGroup">
            {password1Show ? (
              <label>
                Password:
                <input
                  className="inputField"
                  type="text"
                  value={password1}
                  onChange={(e) => setPassword1(e.target.value)}
                  placeholder="Password"
                />
              </label>
            ) : (
              <label>
                Password:
                <input
                  className="inputField"
                  type="password"
                  value={password1}
                  onChange={(e) => setPassword1(e.target.value)}
                  placeholder="Password"
                />
              </label>
            )}
            <label className="checkboxRow">
              Show
              <input
                type="checkbox"
                checked={password1Show}
                onChange={() => setPassword1Show(!password1Show)}
              />
            </label>
          </div>

          {/* Confirm password only for signup */}
          {mode === "signup" && (
            <div className="inputGroup">
              {password2Show ? (
                <label>
                  Confirm:
                  <input
                    className="inputField"
                    type="text"
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                    placeholder="Confirm Password"
                  />
                </label>
              ) : (
                <label>
                  Confirm:
                  <input
                    className="inputField"
                    type="password"
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                    placeholder="Confirm Password"
                  />
                </label>
              )}
              <label className="checkboxRow">
                Show
                <input
                  type="checkbox"
                  checked={password2Show}
                  onChange={() => setPassword2Show(!password2Show)}
                />
              </label>
            </div>
          )}

          <button className="submitBtn" onClick={mode === "login" ? login : signup}>
            {mode === "login" ? "Login" : "Sign Up"}
          </button>
        </div>

        <div className="statusPanel">
          {error &&
            error === 200 ? (
              <p className="successMsg">{error}</p>
            ) : (
              <p className="errorMsg">{error}</p>
            )}
          {errorText && <p className="errorMsg">{errorText}</p>}
        </div>
      </div>
    </div>
  );
}