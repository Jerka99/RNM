import React, { useState } from "react";
import { useContextComp } from "./MyContext";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "./searchUsers/SearchBar";
import Loading from "./Loading";

const Header = () => {
  const { setUser, user, socket, setFriendsList, animation, serverColdStart } = useContextComp();
  const navigate = useNavigate();


  const logOutFun = () => {
    fetch(`${import.meta.env.VITE_BASE_URL}/logout`, {
      credentials: "include", // could also try 'same-origin'
      headers: { "Content-Type": "application/json" }, //important!
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data), setUser(""), navigate("/");
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setFriendsList({}), socket.disconnect();
      });
  };

  return (
    <header id={user.email ? "loggedin-header" : "login-header"}>
      {user.email && <SearchBar />}
      {!user.email && <div></div>}
      {serverColdStart && <div id="server-connection-indicator"><Loading/></div>}
      <nav
        className={
          user.email ? "nav-loggedin" : `nav-login ${animation ? "active" : ""}`
        }
      >
        {!user.email && (
          <li >
            <Link to="/login" replace>Log in</Link>
          </li>
        )}
        {!user.email && (
          <li >
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
