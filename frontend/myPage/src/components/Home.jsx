import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useContextComp } from "./MyContext";
import capitalize from "../functions/capitalize"
const Home = () => {
  const { user, setToggleInput, toggleInput } = useContextComp();

  return (
    <div id="home" onClick={()=>toggleInput && setToggleInput(false)}>
      <h3>Home</h3>
      <h1>Welcome {capitalize(user.name)}</h1>
      
    </div>
  );
};

export default Home;
