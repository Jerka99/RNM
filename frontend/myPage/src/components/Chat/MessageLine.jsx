import React, { useEffect, useState } from "react";
import { useContextComp } from "../MyContext";
import epochToDate from "../../functions/epochToDate";

const MessageLine = ({ el, i }) => {
  const { user, socket } = useContextComp();
  const [status, setStatus] = useState(el.status);
  const [displayTime, setDisplayTime] = useState(false);

    useEffect(() => {
      socket.on("seen", (data) => {
        (status == 1 || status == null) && setStatus(data.time);
        data.time != 1 && data.time != null && socket.off("seen");
      });
    }, [socket]);
  

  return (
    <>
      <div id={el.sender == user.email ? "sender" : "recipient"}>
        <p onClick={() => setDisplayTime((prev) => !prev)}>
          {el.message}
          {status == null && el.sender == user.email ? (
            <>
              <small id="sent"></small>
            </>
          ) : status == 1 && el.sender == user.email ? (
            <>
              <small id="received"></small>
              <small id="received"></small>
            </>
          ) : (
            <>
              <small id="seen"></small>
              <small id="seen"></small>
            </>
          )}
        </p>
        <small className={`time ${displayTime ? "active" : ""} `}>
          <div>sent at: {epochToDate(el.time)}</div>
          {el.sender == user.email && (
            <div>
              seen:{" "}
              {status == null || status == 1
                ? "-- "
                : epochToDate(status, true)}
            </div>
          )}
        </small>
      </div>
    </>
  );
};

export default MessageLine;
