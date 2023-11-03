import React, { memo, useEffect, useRef, useState } from "react";
import { useContextComp } from "../MyContext";
import FriendFromListInChat from "./FriendFromListInChat";
import Chat from "./Chat";

const ChatHolder = () => {
  const { friendsList, setToggleInput, toggleInput, socket, user } =
    useContextComp();
  const [recipient, setRecipient] = useState({ user: "", id: "" });
  const [onlineUsers, setOnlineUsers] = useState({});
  const [messageOutOfRoom, setMessageOutOfRoom] = useState({});
  const [messagesList, setMessagesList] = useState([{}]);

  const createMessageBody = ({ sender, msg }) => {
    const message = {
      time: Math.floor(Date.now() / 1000),
      message: msg,
      receiver: recipient.user,
      sender: sender,
    };
    return message;
  };

  const sendSeenToBase = (receiver, status) => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/messages`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" }, //important!
      body: JSON.stringify({
        sender: receiver,
        receiver: user.email,
        status: status ?? Math.floor(Date.now() / 1000),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("eeeeeeeeeej", data);
      });
  };

  const setMessageOutOfRoomFun = (sender) => {
    console.log("sender", sender, messageOutOfRoom[sender]);
    setMessageOutOfRoom((prev) => ({
      ...prev,
      [sender]: {
        lastActivity: prev[sender].lastActivity,
        unreadMessages: (prev[sender]?.unreadMessages ?? 0) + 1,
      },
    }));
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/messagesnumber`, {
      method: "post",
      headers: { "Content-Type": "application/json" }, //important!
      body: JSON.stringify({
        receiver: user.email,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        data.forEach((element) => {
          console.log("element", element);
          setMessageOutOfRoom((prev) => ({
            ...prev,
            [element.email]: {
              unreadMessages: element.unreadMessages,
              lastActivity: element.lastActivity,
            },
          }));
        });
      });
  }, []);

  useEffect(() => {
    socket.on("remove user", (data) => {
      setOnlineUsers((prev) => {
        const newObj = { ...prev };
        delete newObj[data.user];
        return { ...newObj };
      });
      setMessageOutOfRoom((prev) => ({
        ...prev,
        [data.user]: {
          lastActivity: data.time,
          unreadMessages: prev[data.user]?.unreadMessages,
        },
      }));
    });

    socket.on("users", (data) => {
      console.log("users", data);
      //gets users logged before you
      setOnlineUsers(data);
    });

    socket.on("user connected", (data) => {
      console.log("user connected", data);
      //on refresh and login user gets new socket id and this is trigered
      setOnlineUsers((prev) => ({ ...prev, [data.email]: data }));
    });
  }, [socket]);

  console.log("CHATHOLDER", socket);

  useEffect(() => {
    socket.off("private message");
    socket.on("private message", (data) => {
      console.log("SEENFROMCHAT", recipient.user, "?", data.sender);
      if (recipient.user == data.sender) {
        sendSeenToBase(recipient.user);
        setMessagesList((prev) => [...prev, createMessageBody(data)]);
        socket.emit("seen", {
          //seen when send message if in same room
          sender: user.email,
          to: recipient.user,
          time: Math.floor(Date.now() / 1000),
        });
      } else {
        console.log("CHATHOLDER", data.sender);
        socket.emit("seen", {
          sender: user.email,
          to: data.sender,
          time: 1,
        });
        sendSeenToBase(data.sender, 1);
        setMessageOutOfRoomFun(data.sender);
      }
    });
  }, [socket, recipient.user]);

  return (
    <div id="myChat" onClick={() => toggleInput && setToggleInput(false)}>
      <div id="friends-list">
        <h1>Friends list</h1>
        {Object.values(friendsList).map((el) => {
          return (
            <div
              key={el.email}
              onClick={() => {
                setRecipient({
                  user: el.email,
                  id: el.userId,
                });
                setMessagesList([{}]);
                sendSeenToBase(el.email);
                setMessageOutOfRoom((prev) => ({
                  ...prev,
                  [el.email]: {
                    lastActivity: prev[el.email].lastActivity,
                    unreadMessages: 0,
                  },
                }));
              }}
            >
              <FriendFromListInChat
                el={el}
                onlineUsers={onlineUsers[el.email]?.userId ?? "offline"}
                messageOutOfRoom={messageOutOfRoom[el.email]?.unreadMessages}
              />
            </div>
          );
        })}
      </div>
      {recipient.user && (
        <Chat
          recipient={recipient}
          setRecipient={setRecipient}
          onlineUsers={onlineUsers}
          createMessageBody={createMessageBody}
          sendSeenToBase={sendSeenToBase}
          setMessageOutOfRoomFun={setMessageOutOfRoomFun}
          lastActivity={messageOutOfRoom[recipient.user].lastActivity}
          messagesList={messagesList}
          setMessagesList={setMessagesList}
        />
      )}
    </div>
  );
};

export default ChatHolder;
