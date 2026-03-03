import { useEffect, useState } from "react";
import "./Login.css";
import { Link } from "react-router-dom";

export default function Signup() {
  const [username, setUsername] = useState("")
  const [password1, setPassword1] = useState("")
  const [email, setEmail] = useState("")
  const [password1Show, setPassword1Show] = useState(false)
  const [password2, setPassword2] = useState("")
  const [password2Show, setPassword2Show] = useState(false)
  const [error, setError] = useState("")
  const [errorText, setErrorText] = useState("")
  const [range, setRange] = useState(false)
  const [capital, setCapital] = useState(false)
  const [number, setNumber] = useState(false)
  const [special, setSpecial] = useState(false)

  async function signup() {
    if (password1 === password2 && range && capital && number && special){
      const res = await fetch("http://localhost:5000/signup", {
        method:"POST",
        mode: 'no-cors',
        credentials:"include",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: username,
          password: password1,
          email
        })
      })
      setError(res.status)
    } 
    else {
      setErrorText(null)
      setError(null)
    }
  }

  useEffect(()=> {
    if (password1.length > 20){
      setPassword1(password1.slice(0, -1))
    }
    setRange(password1.length >= 7)
    setCapital(/[A-Z]/.test(password1))
    setNumber(/[0-9]/.test(password1))
    setSpecial(/[^a-zA-Z0-9]/.test(password1))
  }, [password1])

  useEffect(()=> {
    if (password2.length > 20){
      setPassword2(password2.slice(0, -1))
    }
  }, [password2])
    
  return (
    <div className="loginWrapper">
      <div className="loginContainer">

        <div className="validationPanel">
          {!range && <p className="errorMsg">Length range: 7 - 20</p>}
          {!capital && <p className="errorMsg">One or more capital letters</p>}
          {!number && <p className="errorMsg">One or more numbers</p>}
          {!special && <p className="errorMsg">One or more special characters</p>}
          {password1 !== password2 && <p className="errorMsg">Passwords do not match</p>}
        </div>

        <div className="formSection">

        <div className="inputGroup">
            <label>
              Email:
              <input
                className="inputField"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email"
              />
            </label>
          </div>
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
            {password1Show ?
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
            :
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
            }
            <label className="checkboxRow">
              Show
              <input
                type="checkbox"
                checked={password1Show}
                onChange={() => setPassword1Show(!password1Show)}
              />
            </label>
          </div>

          <div className="inputGroup">
            {password2Show ?
              <label>
                Confirm:
                <input
                  className="inputField"
                  type="text"
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                  placeholder="Password Confirm"
                />
              </label>
            :
              <label>
                Confirm:
                <input
                  className="inputField"
                  type="password"
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                  placeholder="Password Confirm"
                />
              </label>
            }
            <label className="checkboxRow">
              Show
              <input
                type="checkbox"
                checked={password2Show}
                onChange={() => setPassword2Show(!password2Show)}
              />
            </label>
          </div>

          <Link to='/' className="submitBtn" onClick={signup}>
            Sign Up
          </Link>
        </div>

        <div className="statusPanel">
          {error &&
            error === 200 ?
              <p className="successMsg">{error}</p>
              :
              <p className="errorMsg">{error}</p>
          }
          {errorText && <p className="errorMsg">{errorText}</p>}
        </div>

      </div>
    </div>
  );
}