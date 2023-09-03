import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
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
  const [friendsList, setFriendsList] = useState({});
  const [unchangedFriendList, setUnchangedFriendList] = useState({});
  const [toggleInput, setToggleInput] = useState(false);

  console.log("MyContext");

  const getFriends = () => {
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
              userId: "offline",
            },
          }));
        });
      });
  };

  useEffect(() => {
    getFriends();
    user.email && socket.connect();
  }, [user]);

  const updateFriendsList = (data, todo) =>{
    const {email, name, secondname, user} = data
    todo == 'accept' && setFriendsList(prev => ({
      ...prev, [email] :{
        name: name,
        secondname: secondname,
        email: email
      }
    }))

    todo == 'delete' && setFriendsList(prev => {
      const obj = {...prev};
      delete obj[email];
      return obj
    })
  }
  
  useEffect(() => {
    socket.on("invitation", (data) => {
      data.friendsListUpdate == 'delete' && setFriendsList(prev => {
        const obj = {...prev};
        delete obj[data.user];
        return obj
      })

      data.friendsListUpdate == 'accept' && setFriendsList(prev => ({
        ...prev, [data.user] :{
          name: data.name,
          secondname: data.secondname,
          email: data.user
        }
      }))
    });
  }, [socket]);

  useEffect(() => {
    socket.on("remove user", (data) => {
      setFriendsList((prev) => {
        const newObj = { ...prev };
        Object.values(prev).forEach((el) => {
          if (el.userId == data) {
            newObj[el.email].userId = 'offline'
          }
        });console.log("NEWOBJ",newObj)
        return { ...newObj };
      });
    });
    socket.on("users", (data) => {console.log("QQQQQQQQQQQQQQQQQQQ",data)
      //gets users logged before you
      Object.keys(data).forEach(el=>{
        if(Object.keys(friendsList).includes(el)){
          setFriendsList(prev => {
            const newObj = { ...prev };
            newObj[el].userId = data[el].userId
            return newObj;
          })
        }
      })
    });
      socket.on("user connected", (data) => {
        //on refresh and login user gets new socket id and this is trigered
        console.log(data, Object.keys(friendsList))
        Object.keys(friendsList).includes(data.email) && setFriendsList((prev) => ({
          ...prev,
          [data.email]: {
            ...data,
            userId: data?.userId,
          },
        }));
      });
  }, [socket, friendsList]);

  console.log('friendsList', friendsList)

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
            navigate("/home"));
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
        updateFriendsList,
        friendsList,
        getFriends,
        toggleInput,
        setToggleInput,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

export default MyContextComp;
