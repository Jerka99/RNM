import React, { useEffect, useRef, useState } from "react";
import { PiMagnifyingGlassBold } from "react-icons/pi";
import { useContextComp } from "./MyContext";
import UserInList from "./UserInList";

const SearchBar = () => {
  const { user, socket, onlineInObject } = useContextComp();
  const [toggleInput, setToggleInput] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const ref = useRef(null);

  const searchUsers = (e) => {
    e.preventDefault();
    e.target.value == "" && setUsersList([]);
    e.target.value.trim() &&
      fetch("http://localhost:4000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" }, //important!
        body: JSON.stringify([e.target.value.trim(), user.email]),
      })
        .then((response) => response.json())
        .then((data) => {
          setUsersList(data);
        })
        .catch((err) => console.error(err));
  };

  console.log("usersList", usersList);

  const uniqueUsersFun = (arr) => {
    let uniqueEl = [];
    const checkEl = (x) => {
      const found = uniqueEl.some((e) => e.email === x);
      return found;
    };

    arr.forEach((element) => {
      if (!checkEl(element.email)) {
        element.userId = onlineInObject[element.email]?.userId;
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
          onChange={(e) => searchUsers(e)}
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
        }}
      >
        <PiMagnifyingGlassBold />
      </button>
      {usersList.length > 0 && toggleInput && (
        <div id="users-list">
          {uniqueUsersFun(usersList).map((element) => {
            return (
              <UserInList key={element.email} element={element} user={user} />
            );
          })}
        </div>
      )}
    </form>
  );
};

export default SearchBar;
