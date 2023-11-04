import React, { useEffect, useState } from 'react'
import capitalize from "../../functions/capitalize"
import { TbMessageCircle2 } from "react-icons/tb";

const FriendFromList = ({el, onlineUsers, messageOutOfRoom}) => {
  
  return (
    <>
    <p>{`${capitalize(el.name)} ${capitalize(el.secondname)}`}</p>

    {/* <p>{`${el.name} ${el.secondname} ${el.userId}`}</p> */}
    {messageOutOfRoom > 0 && <div id='new-messages'><TbMessageCircle2/><div><small>{messageOutOfRoom}</small></div></div>}
    <div
      className={`friend ${onlineUsers != "offline" ? "online" : ""}`}
    ></div>
  </>
  )
}

export default FriendFromList
