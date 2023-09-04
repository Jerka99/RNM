import React, { useEffect, useRef, useState } from "react";
import { PiMagnifyingGlassBold } from "react-icons/pi";
import { useContextComp } from "../MyContext";
import UserInList from "./UserInList";

const SearchBar = () => {
  const { user, toggleInput, setToggleInput } = useContextComp();
  const [usersList, setUsersList] = useState([]);
  const [userName, setUserName] = useState("");
  const ref = useRef(null);

  const searchUsers = () => {
    userName.trim() == "" && setUsersList([]);
    userName.trim() &&
      fetch("http://localhost:4000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" }, //important!
        body: JSON.stringify([userName.trim(), user.email]),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setUsersList(data);
        })
        .catch((err) => console.error(err));
  };

  useEffect(() => searchUsers(), [userName]);

  const uniqueUsersFun = (arr) => {
    const uniqueEl = [];
    const checkEl = (x) => {
      const found = uniqueEl.some((e) => e.email === x);
      return found;
    };

    arr.forEach((element) => {
      if (!checkEl(element.email)) {
        uniqueEl.push(element);
      }
    });
    return uniqueEl;
  };

  return (
    <form>
      <label>
        <input
          ref={ref}
          className={`users-search${toggleInput ? " active" : ""}`}
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
      </label>
      <button
        id="search-button"
        onClick={(e) => {
          e.preventDefault();
          setTimeout(() => {
            ref.current.focus();
          }, 100);
          setToggleInput((prev) => !prev);
          !toggleInput && setUserName('') 
        }}
      >
        <PiMagnifyingGlassBold />
      </button>
      {usersList.length > 0 && toggleInput && (
        <div id="users-list">
          {uniqueUsersFun(usersList).map((element) => {
            return (
              <UserInList
                key={element.email}
                element={element}
                user={user}
                searchUsers={searchUsers}
              />
            );
          })}
        </div>
      )}
    </form>
  );
};

export default SearchBar;
