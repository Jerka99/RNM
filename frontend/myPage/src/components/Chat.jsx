import React, { memo, useEffect, useRef, useState } from 'react'
import { useContextComp } from './MyContext';

const Chat = ({recipient, el}) => {
    const [message, setMessage] = useState("");
    const [messagesList, setMessagesList] = useState([{}]);
    const lastmsg = useRef();
    const { socket, friendsList, user } = useContextComp();

  function toBottom() {
    lastmsg.current.scrollIntoView();
  }

 
  const createMessageBody = (msg) => {

    const message = {
      time: Math.floor(Date.now() / 1000),
      message: msg,
      receiver: recipient.user,
      sender: user.email,
    };
    return message;
  };

  useEffect(() => {console.log("1")
    setMessagesList([{}]);
    fetch("http://localhost:4000/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" }, //important!
      body: JSON.stringify({
        recipientEmail: recipient.user,
        sender: user.email,
      }),
    })
      .then((response) => response.json())
      .then((data) => setMessagesList(data));
  }, [recipient.user]);

console.log('recipient',recipient)
  useEffect(() => {
    console.log("SOOCCKJEETTTT");
    const temp = recipient.user;
    socket.off("private message")
    socket.on("private message", (data) => {console.log('recipient2',temp ,data.sender, data.msg)
      
        temp == data.sender && setMessagesList((prev) => [...prev, createMessageBody(data.msg)]);
    });
  }, [socket, recipient]);


  useEffect(() => {
    toBottom();
  }, [messagesList]);

    const sendMessage = (e) => {
        e.preventDefault();
    
        if (message) {
          fetch("http://localhost:4000/messages", {
            method: "POST",
            headers: { "Content-Type": "application/json" }, //important!
            body: JSON.stringify({
              epoch: Math.floor(Date.now() / 1000),
              message: message,
              recipientEmail: recipient.user,
              sender: user.email,
            }),
          })
            .then((response) => response.json())
            .then((data) => console.log(data));
          socket.emit("private message", {
            sender: user.email,
            to: recipient.id,
            msg: message,
          });
        }
        setMessagesList((prev) => [...prev, createMessageBody(message)]);
        setMessage("");
      }




  return (
    <form id="chat" onSubmit={sendMessage}>
    <h1>Chat</h1>
    <div id="messages-list">
      {messagesList.map((el, i) => {
        return (
          <p
            key={parseInt(el.time) + i}
            id={el.sender == user.email ? "sender" : "recipient"}
          >
            {el.message}
          </p>
        );
      })}{" "}
      <div ref={lastmsg} id="bottom"></div>
    </div>
    <p>{`${recipient.user} ${recipient.id}`}</p>
    <textarea
      type="text"
      autoComplete="off"
      value={message}
      onChange={(e) => {
        setMessage(e.target.value);
      }}
    />
    <button type="submit">Send</button>
  </form>
  )
}

export default memo(Chat)
