import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useContextComp } from "./MyContext";
import capitalize from "../functions/capitalize";
const Home = () => {
  const { user, setToggleInput, toggleInput } = useContextComp();
  const makeRequestWithUserGesture = () => {
    if (
      navigator.userAgent.match(
        /SAMSUNG|Samsung|SGH-[I|N|T]|GT-[I|N]|SM-[A|N|P|T|Z]|SHV-E|SCH-[I|J|R|S]|SPH-L/i
      )
    ) {
      let promise = document.requestStorageAccess();

      promise.then(
        (hasAccess) => {
          console.log("allowed", hasAccess);
        },
        (reason) => {
          console.log("denied", reason);
        }
      );
      // your code for Samsung Smartphones goes here...
    }
  };
  return (
    <div id="home" onClick={() => toggleInput && setToggleInput(false)}>
      <h3>Home</h3>
      <h1>Welcome {capitalize(user.name)}</h1>
      <div id="cookie-consent">
        <button onClick={()=>makeRequestWithUserGesture()}>Accept</button>
      </div>
    </div>
  );
};

export default Home;
