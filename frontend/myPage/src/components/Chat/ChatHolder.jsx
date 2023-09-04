import React, { memo, useEffect, useRef, useState } from "react";
import { useContextComp } from "../MyContext";
import FriendFromListInChat from "./FriendFromListInChat";
import Chat from "./Chat";

const ChatHolder = () => {
  const { socket, friendsList, user, setToggleInput, toggleInput } = useContextComp();
  const [recipient, setRecipient] = useState({ user: "", id: "" });
  console.log("CHATholder", recipient);

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
