import React, { useEffect, useState } from 'react'
import capitalize from "../../functions/capitalize"
const FriendFromList = ({el, onlineUsers, messageOutOfRoom}) => {

  return (
    <>
    <p>{`${capitalize(el.name)} ${capitalize(el.secondname)}`}</p>

    {/* <p>{`${el.name} ${el.secondname} ${el.userId}`}</p> */}
    {messageOutOfRoom > 0 && <div>{messageOutOfRoom}</div>}
    <div
      className={`friend ${onlineUsers != "offline" ? "online" : ""}`}
    ></div>
  </>
  )
}

export default FriendFromList
