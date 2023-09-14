import React, { useState } from 'react'
import { useContextComp } from '../MyContext';
import epochToDate from "../../functions/epochToDate";

const MessageLine = ({el, i}) => {
    const { user } = useContextComp();

    const [displayTime, setDisplayTime] = useState(false)

    return (<>          
        <div id={el.sender == user.email ? "sender" : "recipient"}>
          <p  onClick={() => setDisplayTime(prev=>!prev)}>
            {el.message}
          </p>
          <small className={`time ${displayTime ? "active" : ""} `}>
            {epochToDate(el.time)}
          </small>
        </div></>
      );
}

export default MessageLine
