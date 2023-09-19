import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { io } from "socket.io-client";

const socket = io(`${import.meta.env.VITE_BASE_URL}`, {
  transports: ['websocket'],
  autoConnect: false,
  withCredentials: true, // bez ovoga u sessionu ne mogu naci usera
});
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

  console.log("MyContext");

  const getFriends = () => {
    fetch(`${import.meta.env.VITE_BASE_URL}/friends`, {
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
              // userId: onlineUsers[element.email]?.userId ?? "offline",
            },
          }));
        });
      });
  };

  useEffect(() => {
    user.email && socket.connect();
    user.email && getFriends();
  }, [user]);

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

  const loginFun = () => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_BASE_URL}/login`, {
      credentials: "include", // could also try 'same-origin'
      headers: { "Content-Type": "application/json" }, //important!
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.loggedIn == true) {
          const { name, secondname, email } = data?.user[0];
          setUser({ name: name, secondname: secondname, email: email }),
            navigate("/home", { replace: true });
        }
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    let timer = setTimeout(() => {
      setServerColdStart(true);
    }, 1000);

    fetch(`${import.meta.env.VITE_BASE_URL}/checkserver`, {
      headers: { "Content-Type": "application/json" }, //important!
    })
      .then((response) => response.json())
      .then((data) => {
        clearTimeout(timer), console.log(data), loginFun();
      })
      .catch((error) => console.error(error))
      .finally(() => setServerColdStart(false));
  }, []);

  const logIn = (userInfo) => {
    fetch(`${import.meta.env.VITE_BASE_URL}/login`, {
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
