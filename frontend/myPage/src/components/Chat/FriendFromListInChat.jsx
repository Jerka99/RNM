import React, { useEffect, useState } from 'react'
import capitalize from "../../functions/capitalize"
const FriendFromList = ({el, onlineUsers}) => {

  return (
    <>
    <p>{`${capitalize(el.name)} ${capitalize(el.secondname)}`}</p>

    {/* <p>{`${el.name} ${el.secondname} ${el.userId}`}</p> */}
    <div
      className={`friend ${onlineUsers != "offline" ? "online" : ""}`}
    ></div>
  </>
  )
}

export default FriendFromList
