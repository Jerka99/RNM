import React, { useEffect, useState } from "react";
import { useContextComp } from "./MyContext";

const Chat = () => {
  const { socket, onlineUsers } = useContextComp();
  const [message, setMessage] = useState("");
  const [recipient, setRecipient] = useState("");

  console.log("CHAT");

  // useEffect(() => {
  //   socket.connect();
  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);

  console.log("EEE",onlineUsers)

  

  console.log(socket);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message) {
      socket.emit("private message", {
        to: recipient,
        msg: message,
      });
    }
    setMessage("");
  };

  console.log(message);

  return (
    <div>
      <div id="online">

        {onlineUsers.map((el) => {
          return (
            <p
              onClick={() => setRecipient(el.userId)}
              key={el.email}
            >{`${el.user} ${el.userId}`}</p>
          );
        })}
      </div>

      <form id="chat" onSubmit={sendMessage}>
        <h1>Chat</h1>
        <input
          type="text"
          autoComplete="off"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;
