import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000", {
  autoConnect: false,
  withCredentials: true, // bez ovoga u sessionu ne mogu naci usera
});
const MyContext = createContext();

export function useContextComp() {
  return useContext(MyContext);
}

import React from "react";
import { useNavigate } from "react-router";

const MyContextComp = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "", secondname: "", email: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState({});
  const [friendsList, setFriendsList] = useState({});
  const [toggleInput, setToggleInput] = useState(false);

  console.log("MyContext");


  const getFriends = (x) => {
    x == 'delete' && setFriendsList({});
    fetch("http://localhost:4000/friends", {
      method: "POST",
      headers: { "Content-Type": "application/json" }, //important!
      body: JSON.stringify([user.email]),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("DATA", data);
        data.forEach((element) => {
          setFriendsList((prev) => ({
            ...prev,
            [element.email]: {
              ...element,
              userId: onlineUsers[element.email]?.userId ?? "offline",
            },
          }));
        });
      });
  };

  console.log("ONLINEUSERS", onlineUsers)

  useEffect(() => {
    Object.values(onlineUsers).length > 0 && getFriends();
  }, [onlineUsers]);

  useEffect(() => {

    socket.on("remove user", (data) => {
      setOnlineUsers((prev) => {
        const newObj = { ...prev };
        Object.values(prev).forEach((el) => {
          if (el.userId == data) {
            delete newObj[el.email];
          }
        });
        return { ...newObj };
      });
    });

    socket.on("users", (data) => {
      //gets users logged before you
      setOnlineUsers(data);
    });

    socket.on("user connected", (data) => {
      //on refresh and login user gets new socket id and this is trigered
      setOnlineUsers((prev) => ({ ...prev, [data.email]: data }));
    });
  }, [socket]);

  useEffect(() => {
    location.href == "http://localhost:5173/login" && setMessage("");
  }, [location.href]);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:4000/login", {
      credentials: "include", // could also try 'same-origin'
      headers: { "Content-Type": "application/json" }, //important!
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.loggedIn == true) {
          socket.connect();
          const { name, secondname, email } = data?.user[0];
          setUser({ name: name, secondname: secondname, email: email }),
            navigate("/home");
        }
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  const logIn = (userInfo) => {
    fetch("http://localhost:4000/login", {
      credentials: "include", // could also try 'same-origin'
      method: "POST",
      headers: { "Content-Type": "application/json" }, //important!
      body: JSON.stringify(userInfo),
    })
      .then((response) => response.json())
      .then((data) => {
        data.message
          ? setMessage(data.message)
          : (setUser({
              name: data[0].name,
              secondname: data[0].secondname,
              email: data[0].email,
            }),
            navigate("/home")),
          socket.connect();
      })
      .catch((err) => console.error(err));
  };


  return (
    <MyContext.Provider
      value={{
        logIn,
        setUser,
        user,
        message,
        loading,
        socket,
        onlineUsers,
        friendsList,
        getFriends,
        toggleInput,
        setToggleInput
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

export default MyContextComp;
