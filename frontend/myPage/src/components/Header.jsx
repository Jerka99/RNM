import React, { useState } from "react";
import { useContextComp } from "./MyContext";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "./searchUsers/SearchBar";
import Loading from "./Loading";
import UniversalCookie from "universal-cookie";

const cookies = new UniversalCookie();

const Header = () => {
  const { setUser, user, socket, setFriendsList, animation, serverColdStart } =
    useContextComp();
  const navigate = useNavigate();

  const logOutFun = () => {
    setUser("");
    navigate("/");
    cookies.remove("token");
    setFriendsList({});
    socket.disconnect();
  };

  return (
    <header id={user.email ? "loggedin-header" : "login-header"}>
      {user.email && <SearchBar />}
      {!user.email && <div></div>}
      {serverColdStart && (
        <div id="server-connection-indicator">
          <Loading />
        </div>
      )}
      <nav
        className={
          user.email ? "nav-loggedin" : `nav-login ${animation ? "active" : ""}`
        }
      >
        {!user.email && (
          <li>
            <Link to="/login" replace>
              Log in
            </Link>
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
