import React, { memo, useEffect, useRef, useState } from "react";
import { useContextComp } from "../MyContext";
import { AiOutlineClose } from "react-icons/ai";
import capitalize from "../../functions/capitalize";
import MessageLine from "./MessageLine";

const Chat = ({ recipient, setRecipient }) => {
  const [message, setMessage] = useState("");
  const [messagesList, setMessagesList] = useState([{}]);
  const [typing, setTyping] = useState({boolean:false, sender:""});
  const lastmsg = useRef();
  const { socket, friendsList, user } = useContextComp();

  function toBottom() {
    lastmsg.current.scrollIntoView();
  }

  const createMessageBody = ({ sender, msg }) => {
    const message = {
      time: Math.floor(Date.now() / 1000),
      message: msg,
      receiver: recipient.user,
      sender: sender,
    };
    return message;
  };

  useEffect(() => {
    setMessagesList([{}]);
    setMessage("")
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

  useEffect(() => {
    const temp = recipient.user;
    socket.off("private message");
    socket.on("private message", (data) => {
      console.log("recipient2", temp, data.sender, data.msg);

      temp == data.sender &&
        setMessagesList((prev) => [...prev, createMessageBody(data)]);
    });
    let idTimer
    socket.on("typing", (data) => {
      clearTimeout(idTimer)
      setTyping({boolean:true, sender:data.sender});
      idTimer = setTimeout(() => {
        setTyping({boolean:false, sender:data.sender});
      }, 700);
      
      
  });
    
  }, [socket, recipient]);

  // console.log(value)

  useEffect(() => {
    toBottom();
  }, [messagesList]);

  const sendMessage = (e) => {
    e.preventDefault();

    if (message.trim().length > 0) {
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
        to: friendsList[recipient.user].email,
        msg: message,
      });

      setMessagesList((prev) => [
        ...prev,
        createMessageBody({ sender: user.email, msg: message }),
      ]);
    }
    setMessage("");
  };

  const onEnterPress = (e) => {
    if (e.keyCode == 13 && e.shiftKey == false) {
      e.preventDefault();
      sendMessage(e);
    }
  };
  console.log(socket);
  return (
    <form id="chat" onSubmit={sendMessage}>
      <div id="chat-with">
        <p>{`${capitalize(friendsList[recipient.user]?.name)} ${capitalize(
          friendsList[recipient.user]?.secondname
        )}`}</p>
        {(recipient.user == typing.sender && typing.boolean) ? <small>typing...</small> : friendsList[recipient.user]?.userId != "offline" && (
          <small>online</small>
        )}
        <p id="close" onClick={() => setRecipient({ user: "", id: "" })}>
          <AiOutlineClose />
        </p>
      </div>
      <div id="messages-list">
        {messagesList.map((el, i) => {
          return <MessageLine key={parseInt(el.time) + i} el={el} i={i} />;
        })}{" "}
        <div ref={lastmsg} id="bottom"></div>
      </div>
      {/* <p>{`${recipient.user} ${friendsList[recipient.user]?.userId}`}</p> */}
      <textarea
        onKeyDown={onEnterPress}
        type="text"
        autoComplete="off"
        value={message}
        onChange={(e) => {
          socket.emit("typing", {
            sender: user.email,
            to: friendsList[recipient.user].email,
          });
          setMessage(e.target.value);
        }}
      />
      <button type="submit">Send</button>
    </form>
  );
};

export default memo(Chat);
