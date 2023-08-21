import React, { useEffect, useState } from "react";
import { useContextComp } from "./MyContext";

const UserInList = ({ element, user }) => {
  const [invitation, toggleInvitation] = useState(element.status);
  const { socket } = useContextComp();

  useEffect(() => {
    socket.on("invitation", (data) => {
      element.email == data.user && toggleInvitation(data.msg);
    });
  }, [socket]);

  const Broadcast = (message, recipient) => {
    socket.emit("invitation", {
      user: user.email,
      to: recipient,
      msg: message,
    });
  };

  const addFriendFun = (accepted, status) => {
    fetch("http://localhost:4000/relations", {
      method: invitation == null ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" }, //important!
      body: JSON.stringify({
        sender: user.email,
        receiver: element.email,
        status: status,
        accepted: accepted,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data),
          data.accepted
            ? (toggleInvitation("friends"),
              Broadcast("friends", element.userId))
            : (toggleInvitation(0), Broadcast("true", element.userId));
      })
      .catch((err) => console.error("err", err));
  };

  const deleteFriendReqInv = () => {
    fetch("http://localhost:4000/relations", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }, //important!
      body: JSON.stringify({
        sender: user.email,
        receiver: element.email,
      }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((err) => console.error("err", err))
      .finally(() => {
        toggleInvitation(null), Broadcast(null, element.userId);
      });
  };
  console.log(invitation);
  return (
    <div key={element.email}>
      <p>{`${element.name} ${element.secondname}`}</p>
      {element.accepted == 1 || invitation == "friends" ? (
        <button
          onClick={(e) => {
            e.preventDefault();
            deleteFriendReqInv(element.email);
          }}
        >
          Remove Friend
        </button>
      ) : invitation == null ? (
        <button
          onClick={(e) => {
            e.preventDefault();
            addFriendFun(false, true);
          }}
        >
          Add
        </button>
      ) : invitation == 0 ? (
        <button
          onClick={(e) => {
            e.preventDefault();
            deleteFriendReqInv();
          }}
        >
          Cancel
        </button>
      ) : (
        <>
          <button
            onClick={(e) => {
              e.preventDefault();
              addFriendFun(true, null);
            }}
          >
            Accept
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              deleteFriendReqInv();
            }}
          >
            Decline
          </button>
        </>
      )}
    </div>
  );
};

export default UserInList;
