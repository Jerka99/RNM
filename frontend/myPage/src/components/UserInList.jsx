import React, { useEffect, useState } from "react";
import { useContextComp } from "./MyContext";
import capitalize from "../functions/capitalize";

const UserInList = ({ element, user }) => {
  const [invitation, toggleInvitation] = useState(element.status);
  const { socket, getFriends, onlineUsers } = useContextComp();

  useEffect(() => {
    socket.on("invitation", (data) => {
      console.log("data.msg", data.msg);
      element.email == data.user && toggleInvitation(data.msg);
      console.log("XXXXXXXXXXXX",data.friendsListUpdate);
      data.friendsListUpdate && getFriends('delete');
    });
  }, [socket]);

  const Broadcast = (message, friendsListUpdate, receiver) => {
    socket.emit("invitation", {
      friendsListUpdate: friendsListUpdate,
      receiver: receiver,
      msg: message,
    });
  };

  const addFriendFun = (accepted, status, friendsListUpdate) => {
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
            ? (toggleInvitation("friends"), Broadcast("friends", friendsListUpdate, element.email)) //accept decline
            : (toggleInvitation(0), Broadcast("true", friendsListUpdate, element.email)); //send invitation
      })
      .catch((err) => console.error("err", err))
      .finally(() => {
        accepted == true && status == true && getFriends();
      });
  };

  const deleteFriendReqInv = (boolean, friendsListUpdate, x) => {
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
        toggleInvitation(null);
        Broadcast(null, friendsListUpdate, element.email);
        element.accepted = 0;
        boolean && getFriends(x);
      });
  };
  console.log("invitation", invitation);
  return (
    <div key={element.email}>
      <p>{`${capitalize(element.name)} ${capitalize(element.secondname)}`}</p>
      {(invitation == 1 && element.accepted == 1) || invitation == "friends" ? (
        <button
          onClick={(e) => {
            e.preventDefault();
            deleteFriendReqInv(true, true, 'delete');
          }}
        >
          Remove Friend
        </button>
      ) : invitation == null ? (
        <button
          onClick={(e) => {
            e.preventDefault();
            addFriendFun(false, true, false);
          }}
        >
          Add
        </button>
      ) : invitation == 0 ? (
        <button
          onClick={(e) => {
            e.preventDefault();
            deleteFriendReqInv(false, false);
          }}
        >
          Cancel
        </button>
      ) : (
        <div>
          <button
            onClick={(e) => {
              e.preventDefault();
              addFriendFun(true, true, true);
            }}
          >
            Accept
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              deleteFriendReqInv(true, false);
            }}
          >
            Decline
          </button>
        </div>
      )}
    </div>
  );
};

export default UserInList;
