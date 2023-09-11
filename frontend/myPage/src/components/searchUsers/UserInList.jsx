import React, { useEffect, useState } from "react";
import { useContextComp } from "../MyContext";
import capitalize from "../../functions/capitalize";

const UserInList = ({ element, user }) => {
  const [invitation, toggleInvitation] = useState(element.status);
  const { socket, updateFriendsList } = useContextComp();

  useEffect(() => {
    socket.on("invitation", (data) => {
      element.email == data.user && toggleInvitation(data.msg);
    });
  }, [socket]);


  const Broadcast = (message, friendsListUpdate, receiver) => {
    socket.emit("invitation", {
      friendsListUpdate: friendsListUpdate,
      user: user.email,
      name: user.name,
      secondname: user.secondname,
      receiver: receiver,
      msg: message,
    });
  };

  console.log('invitation',invitation , element.email, element.status)

  const addFriendFun = (accepted, status, friendsListUpdate) => {
    fetch(`${import.meta.env.VITE_BASE_URL}/relations`, {
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
        friendsListUpdate == 'accept' && updateFriendsList(element, 'accept');
      });
  };

  const deleteFriendReqInv = (friendsListUpdate) => {
    fetch(`${import.meta.env.VITE_BASE_URL}/relations`, {
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
        friendsListUpdate == 'delete' && updateFriendsList(element, 'delete');
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
            deleteFriendReqInv('delete');
          }}
        >
          Remove Friend
        </button>
      ) : invitation == null ? (
        <button
          onClick={(e) => {
            e.preventDefault();
            addFriendFun(false, true, 'add');
          }}
        >
          Add
        </button>
      ) : invitation == 0 ? (
        <button
          onClick={(e) => {
            e.preventDefault();
            deleteFriendReqInv('cancel');
          }}
        >
          Cancel
        </button>
      ) : (
        <div>
          <button
            onClick={(e) => {
              e.preventDefault();
              addFriendFun(true, true, 'accept');
            }}
          >
            Accept
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              deleteFriendReqInv('decline');
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
