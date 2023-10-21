import React, { Fragment, memo, useEffect, useRef, useState } from "react";
import { useContextComp } from "../MyContext";
import { BsArrowLeft } from "react-icons/bs";
import Loading from "../Loading";
import capitalize from "../../functions/capitalize";
import MessageLine from "./MessageLine";
import EpochToDateSticky from "./EpochToDateSticky";

const Chat = ({ recipient, setRecipient, onlineUsers }) => {
  const [message, setMessage] = useState("");
  const [messagesList, setMessagesList] = useState([{}]);
  const [typing, setTyping] = useState({ boolean: false, sender: "" });
  const [loading, setLoading] = useState(false);
  const [newHeight, setNewHeight] = useState(window.visualViewport.height - 1);
  const lastmsg = useRef();
  const top = useRef()
  const textareaRef = useRef(null);
  const { socket, friendsList, user } = useContextComp();

  function toBottom() {
    lastmsg.current.scrollIntoView();
  }

  function textAreaFocus() {
    textareaRef.current.focus();
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
  let resizeWindow = () => {
    setNewHeight(window.visualViewport.height - 1);
  };
  let onScroll = () =>{
    top.current.scrollIntoView()
  }
  console.log("socket", socket);
  useEffect(() => {
    resizeWindow();
    window.visualViewport.addEventListener("scroll", onScroll);
    window.addEventListener("touchend", (event) => {console.log('endend')});
    window.addEventListener("resize", resizeWindow);
    return () => {
      window.visualViewport.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resizeWindow);
    };
  }, []);

  useEffect(() => {
    setMessagesList([{}]);
    setLoading(true);
    setMessage("");
    fetch(`${import.meta.env.VITE_BACKEND_URL}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }, //important!
      body: JSON.stringify({
        recipientEmail: recipient.user,
        sender: user.email,
      }),
    })
      .then((response) => response.json())
      .then((data) => setMessagesList(data))
      .finally(() => setLoading(false));
  }, [recipient.user]);

  useEffect(() => {
    const temp = recipient.user;
    socket.off("private message");
    socket.on("private message", (data) => {
      temp == data.sender &&
        setMessagesList((prev) => [...prev, createMessageBody(data)]);
    });
    let myTimer;
    socket.on("typing", (data) => {
      clearTimeout(myTimer);
      setTyping({ boolean: true, sender: data.sender });
      myTimer = setTimeout(() => {
        setTyping({ boolean: false, sender: data.sender });
      }, 700);
    });
  }, [socket, recipient]);

  useEffect(() => {
    toBottom();
  }, [messagesList]);

  const sendMessage = (e) => {
    e.preventDefault();
    textAreaFocus();
    if (message.trim().length > 0) {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/messages`, {
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

  return (
    <form
      id="chat"
      style={{
        height:
          window.visualViewport.width < 600
            ? newHeight
            : "-webkit-fill-available",
      }}
      onSubmit={sendMessage}
    >
      <div ref={top} id="chat-with">
        {recipient.user == typing.sender && typing.boolean ? (
          <small>typing...</small>
        ) : (
          onlineUsers[recipient.user]?.userId != undefined && (
            <small>online</small>
          )
        )}
        <p>{`${capitalize(friendsList[recipient.user]?.name)} ${capitalize(
          friendsList[recipient.user]?.secondname
        )}`}</p>
        <p id="close" onClick={() => setRecipient({ user: "", id: "" })}>
          <BsArrowLeft />
        </p>
      </div>
      <div id="messages-list">
        {loading ? (
          <Loading />
        ) : (
          messagesList.map((el, i) => {
            return (
              <Fragment key={parseInt(el.time) + i}>
                <EpochToDateSticky
                  time={el.time}
                  recipient={recipient.user}
                  messagesList={messagesList}
                />
                {/*messagesList is added with the purpose of causing render on submit */}
                <MessageLine el={el} i={i} />
              </Fragment>
            );
          })
        )}
        <div ref={lastmsg} id="bottom"></div>
      </div>
      {/* <p>{`${recipient.user} ${friendsList[recipient.user]?.userId}`}</p> */}
      <div id="textarea-button">
        <textarea
          ref={textareaRef}
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
      </div>
    </form>
  );
};

export default memo(Chat);
