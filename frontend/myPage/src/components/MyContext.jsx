import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import UniversalCookie from "universal-cookie";

const cookies = new UniversalCookie();

const MyContext = createContext();

export function useContextComp() {
  return useContext(MyContext);
}

import React from "react";
import { useNavigate } from "react-router-dom";

const MyContextComp = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "", secondname: "", email: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [serverColdStart, setServerColdStart] = useState(false);
  const [friendsList, setFriendsList] = useState({});
  const [toggleInput, setToggleInput] = useState(false);
  const [animation, setAnimation] = useState(false);
  const [socket, setSocket] = useState("");

  console.log("MyContext", user, loading);

  const getFriends = (user) => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/friends`, {
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
            },
          }));
        });
      });
  };

  console.log("socket", socket);

  const updateFriendsList = (data, todo) => {
    const { email, name, secondname, user } = data;
    todo == "accept" &&
      setFriendsList((prev) => ({
        ...prev,
        [email]: {
          name: name,
          secondname: secondname,
          email: email,
        },
      }));

    todo == "delete" &&
      setFriendsList((prev) => {
        const obj = { ...prev };
        delete obj[email];
        return obj;
      });
  };

  useEffect(() => {
    user.email &&
      socket.on("invitation", (data) => {
        data.friendsListUpdate == "delete" &&
          setFriendsList((prev) => {
            const obj = { ...prev };
            delete obj[data.user];
            return obj;
          });

        data.friendsListUpdate == "accept" &&
          setFriendsList((prev) => ({
            ...prev,
            [data.user]: {
              name: data.name,
              secondname: data.secondname,
              email: data.user,
            },
          }));
      });
  }, [socket]);

  useEffect(() => {
    let timer = setTimeout(() => {
      setServerColdStart(true);
    }, 1000);

    fetch(`${import.meta.env.VITE_BACKEND_URL}/checkserver`, {
      headers: { "Content-Type": "application/json" }, //important!
    })
      .then((response) => response.json())
      .then((data) => {
        clearTimeout(timer),
          console.log(data),
          cookies.get("token") ? fetchUserInfo(cookies.get("token")) : navigate('/');
      })
      .catch((error) => console.error(error))
      .finally(() => setServerColdStart(false));
  }, []);

  const fetchUserInfo = (token) => {
    console.log('fetchuseringo')
    setLoading(true);
    fetch(`${import.meta.env.VITE_BACKEND_URL}/login`, {
      credentials: "omit", //"include" could also try 'same-origin'
      headers: {
        Authorization: token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const { name, secondname, email } = data;
        setUser({ name: name, secondname: secondname, email: email });
        navigate("/home", { replace: true });
        getFriends(data);
        console.log("!!!", socket);
        if (!socket.connected) {
          const InitSocket = io(`${import.meta.env.VITE_BACKEND_URL}`, {
            withCredentials: true, // bez ovoga u sessionu ne mogu naci usera
            query: {
              token: cookies.get("token"),
            },
          });

          setSocket(InitSocket);
        }
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  };

  const logIn = (userInfo) => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/login`, {
      credentials: "omit", // for 3rd party cookie use 'include' u can also try 'same-origin'
      method: "POST",
      headers: { "Content-Type": "application/json" }, //important!
      body: JSON.stringify(userInfo),
    })
      .then((response) => response.json())
      .then((data) => {
        data.message
          ? setMessage(data.message)
          : (cookies.set("token", data.token, { path: "/", maxAge : '86400' }),
            fetchUserInfo(data.token),
            navigate("/home", { replace: true }),
            setAnimation(false));
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
        serverColdStart,
        socket,
        updateFriendsList,
        friendsList,
        getFriends,
        toggleInput,
        setToggleInput,
        setFriendsList,
        setMessage,
        animation,
        setAnimation,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

export default MyContextComp;
