import { memo, useEffect } from "react";

let tempDay = "";
let tempMonth = "";
let tempYear = "";
let tempStatus = "";

const EpochToDate = ({ time, recipient, status, sender }) => {
  let date = new Date(time * 1000);
  let year = date.getFullYear();
  let month = ("0" + (date.getMonth() + 1)).substr(-2);
  let day = ("0" + date.getDate()).substr(-2);
  let today = new Date();

  useEffect(() => {
    tempDay = "";
    tempMonth = "";
    tempYear = "";
    tempStatus = "";
  }, [recipient]);


  if (tempStatus != null && tempStatus != 1) {
    if ((status == 1 || status == null) && recipient == sender) {
      tempStatus = status;
      return <h5>New messages</h5>;
    }
  }
  if (
    parseInt(day) != tempDay ||
    parseInt(month) != tempMonth ||
    parseInt(year) != tempYear
  ) {
    tempDay = parseInt(day);
    tempMonth = parseInt(month);
    tempYear = parseInt(year);
    if (
      today.getFullYear() == tempYear &&
      today.getMonth() + 1 == parseInt(tempMonth) &&
      today.getDate() == tempDay
    ) {
      return <h5>Today</h5>;
    } else if (
      today.getFullYear() == tempYear &&
      today.getMonth() + 1 == parseInt(tempMonth) &&
      today.getDate() - 1 == tempDay
    ) {
      return <h5>Yesterday</h5>;
    }

    return <h5>{`${tempDay}. ${tempMonth}. ${tempYear}.`}</h5>;
  }
};

export default memo(EpochToDate);
