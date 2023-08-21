import React, { useState } from "react";
import { useContextComp } from "./MyContext";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";

const Header = () => {
  const { setUser, user } = useContextComp();
  const navigate = useNavigate();

  const logOutFun = () => {
    fetch("http://localhost:4000/logout", {
      credentials: "include", // could also try 'same-origin'
      headers: { "Content-Type": "application/json" }, //important!
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data), setUser(""), navigate("/");
      })
      .catch((err) => console.error(err))
      .finally(() => location.reload());
  };


  return (
    <header>
      {user.email && (<SearchBar/>)}
      {!user.email && <div></div>}
      <nav>
        {!user.email && (
          <li>
            <Link to="/login">Log in</Link>
          </li>
        )}
        {!user.email && (
          <li>
            <Link to="/signup">Register</Link>
          </li>
        )}
        {user.email && (
          <li>
            <a onClick={logOutFun}>Log Out</a>
          </li>
        )}
      </nav>
    </header>
  );
};

export default Header;
