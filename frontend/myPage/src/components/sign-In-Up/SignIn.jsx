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
          <label htmlFor="email">E-mail</label>
          <input
            type="text"
            name="email"
            id="email"
            value={userInfo.email}
            // required
            // pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"
            onChange={inputFun}
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={userInfo.password}
            onChange={inputFun}
          />
          <button type="submit">Submit</button>
        </form>
        <h1>{message}</h1>
        <Link to="/signup">Sign Up</Link>
      </div>
    </div>
  );
};

export default SignIn;
