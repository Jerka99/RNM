import { createContext, useContext, useEffect, useState } from "react";
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
  const [onlineInObject, setOnlineInObject] = useState({});
  const [onlineUsers, setOnlineUsers] = useState([]);

  console.log('MyContext')

  useEffect(() => {
    socket.on("private message", (data) => {
      console.log("data", data);
    });

    socket.on("remove user", (data) => {
      setOnlineUsers((prev) => {
        let newArr = [...prev];
        prev.forEach((el, i) => {
          if (el.userId == data) {
            newArr.splice(i, 1);
          }
        });
        return [...newArr];
      });
    });

    socket.on("users", (data) => {
      //gets users logged before you
      setOnlineInObject(data)
      Object.values(data).forEach((element) => {
        console.log("data2", data);
        setOnlineUsers((prev) => [...prev, element]);
      });
    });

    socket.on("user connected", (data) => {
      //on refresh and login user gets new socket id and this is trigered
      setOnlineInObject(prev => ({...prev, [data.email]:data}))
      setOnlineUsers((prev) => {
        return [...prev, data];
      });
    });
  }, [socket]);

  useEffect(() => {
    setMessage("");
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
  console.log("user", user);

  return (
    <MyContext.Provider value={{ logIn, setUser, user, message, loading, socket, onlineUsers, onlineInObject }}>
      {children}
    </MyContext.Provider>
  );
};

export default MyContextComp;
