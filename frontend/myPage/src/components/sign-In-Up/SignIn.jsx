import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useContextComp } from "../MyContext";

const SignIn = () => {

  const { logIn, message, setMessage, animation, setAnimation } = useContextComp();
  const [userInfo, setUserInfo] = useState({ email: "", password: "" });
  const navigate = useNavigate()
  // Axios.defaults.withCredentials = true;

  useEffect(() => {
      setAnimation(true)
      setMessage("")
  }, []);


  const handleSubmit = (e) => {
    e.preventDefault();
    logIn(userInfo);
  };

  const inputFun = (e) => {
    const { name, value } = e.target;
    setMessage("");
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div id="login" className={animation ? "active" : ""}>
      <div className="form-holder">
        <h3>Log in</h3>
        <h3 onClick={()=>{setAnimation(false), setMessage(""), navigate('/')}}>X</h3>
        <form onSubmit={handleSubmit}>
          <div>
          <label htmlFor="email">E-mail</label>
          <input
            className={`input ${message ? "active" : ""}`}
            type="text"
            name="email"
            id="email"
            value={userInfo.email}
            // required
            // pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"
            onChange={inputFun}
          />
          {message == "User doesn't exists" && <span>{message}</span>}</div>
          <div><label htmlFor="password">Password</label>
          <input
            className={`input ${message ? "active" : ""}`}
            type="password"
            name="password"
            id="password"
            value={userInfo.password}
            onChange={inputFun}
          />
          {message == "Wrong password" && <span>{message}</span>}</div>
          <button type="submit">Submit</button>
        </form>
        <p>Need an account? 
        <Link to="/signup">Sign Up</Link></p>
      </div>
    </div>
  );
};

export default SignIn;
