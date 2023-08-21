import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useContextComp } from "./MyContext";

const Home = () => {
  const { user } = useContextComp();

  return (
    <div>
      <h3>Home</h3>
      <h1>Welcome {user.name}</h1>
      
    </div>
  );
};

export default Home;
