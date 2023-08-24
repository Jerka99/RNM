import React, { useEffect, useState } from 'react'

const FriendFromList = ({el, setRecipient}) => {


  return (
    <div key={el.email} onClick={() => setRecipient({user:el.email, id:el.userId})}>

    <p>{`${el.name} ${el.secondname} ${el.userId}`}</p>
    <div
      className={`friend ${el.userId != "offline" ? "online" : ""}`}
    ></div>
  </div>
  )
}

export default FriendFromList
