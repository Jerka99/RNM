import React, { memo, useEffect, useRef, useState } from "react";
import { useContextComp } from "../MyContext";
import FriendFromListInChat from "./FriendFromListInChat";
import Chat from "./Chat";

const ChatHolder = () => {
  const { socket, friendsList, user, setToggleInput, toggleInput } = useContextComp();
  const [recipient, setRecipient] = useState({ user: "", id: "" });
  console.log("CHATholder", recipient);

  return (
    <div id="myChat" onClick={()=>toggleInput && setToggleInput(false)}>
      <div id="friends-list">
        <h1>Friends list</h1>
        {Object.values(friendsList).map((el) => {
          return (
            <FriendFromListInChat
              key={el.email}
              el={el}
              setRecipient={setRecipient}
            />
          );
        })}
      </div>
      {recipient.user && <Chat recipient={recipient} setRecipient={setRecipient}/>}
    </div>
  );
};

export default ChatHolder;
