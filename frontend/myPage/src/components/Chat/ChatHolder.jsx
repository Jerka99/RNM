import React, { memo, useEffect, useRef, useState } from "react";
import { useContextComp } from "../MyContext";
import FriendFromListInChat from "./FriendFromListInChat";
import Chat from "./Chat";

const ChatHolder = () => {
  const { friendsList, setToggleInput, toggleInput, socket } = useContextComp();
  const [recipient, setRecipient] = useState({ user: "", id: "" });
  const [onlineUsers, setOnlineUsers] = useState({});
  
  
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

  return (
    <div id="myChat" onClick={() => toggleInput && setToggleInput(false)}>
      <div id="friends-list">
        <h1>Friends list</h1>
        {Object.values(friendsList).map((el) => {
          return (
            <div
              key={el.email}
              onClick={() => {setRecipient({ user: el.email, id: el.userId })}}
            >
              <FriendFromListInChat
                el={el}
                onlineUsers={onlineUsers[el.email]?.userId ?? "offline"}
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
        />
      )}
    </div>
  );
};

export default ChatHolder;
