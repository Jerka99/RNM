import React, { memo, useEffect, useRef, useState } from "react";
import { useContextComp } from "./MyContext";
import FriendFromListInChat from "./FriendFromListInChat";
import Chat from "./Chat";

const ChatHolder = () => {
  const { socket, friendsList, user } = useContextComp();
  const [recipient, setRecipient] = useState({ user: "", id: "" });

  console.log("CHATholder", recipient);

  return (
    <div>
      <div id="friends-list">
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
      {recipient.user && <Chat recipient={recipient} />}
    </div>
  );
};

export default ChatHolder;
