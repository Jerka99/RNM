import React, { memo, useEffect, useRef, useState } from "react";
import { useContextComp } from "../MyContext";
import { BsArrowLeft } from "react-icons/bs";
import capitalize from "../../functions/capitalize";
import MessageLine from "./MessageLine";

const Chat = ({ recipient, setRecipient, onlineUsers }) => {
  const [message, setMessage] = useState("");
  const [messagesList, setMessagesList] = useState([{}]);
  const [typing, setTyping] = useState({boolean:false, sender:""});
  const [newHeight, setNewHeight] = useState('calc(100% + 42px)');
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
    fetch(`${import.meta.env.VITE_BASE_URL}/messages`, {
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


  useEffect(() => {
    toBottom();
  }, [messagesList]);

  const sendMessage = (e) => {
    e.preventDefault();

    if (message.trim().length > 0) {
      fetch(`${import.meta.env.VITE_BASE_URL}/messages`, {
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
  console.log(window.visualViewport.height)

  return (
    <form id="chat" style={{height:`${newHeight}`}} onSubmit={sendMessage}>
      <div id="chat-with">
        <p>{`${capitalize(friendsList[recipient.user]?.name)} ${capitalize(
          friendsList[recipient.user]?.secondname
        )}`}</p>
        {(recipient.user == typing.sender && typing.boolean) ? <small>typing...</small> : onlineUsers[recipient.user]?.userId != undefined && (
          <small>online</small>
        )}
        <p id="close" onClick={() => setRecipient({ user: "", id: "" })}>
          <BsArrowLeft />
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
        onTouchStart={()=>setTimeout(setNewHeight(window.visualViewport.height))}
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
