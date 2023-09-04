import React, { useEffect, useState } from 'react'
import capitalize from "../../functions/capitalize"
const FriendFromList = ({el, setRecipient, onlineUsers}) => {

  return (
    <div key={el.email} onClick={() => setRecipient({user:el.email, id:el.userId})}>
    <p>{`${capitalize(el.name)} ${capitalize(el.secondname)}`}</p>

    {/* <p>{`${el.name} ${el.secondname} ${el.userId}`}</p> */}
    <div
      className={`friend ${onlineUsers != "offline" ? "online" : ""}`}
    ></div>
  </div>
  )
}

export default FriendFromList
