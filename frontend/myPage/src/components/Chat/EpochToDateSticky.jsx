let tempDay = "";
let tempMonth = "";
let tempYear = "";

const EpochToDate = ({time}) => {
  let date = new Date(time * 1000);
  let year = date.getFullYear();
  let month = ("0" + (date.getMonth() + 1)).substr(-2);
  let day = ("0" + date.getDate()).substr(-2);
  let today = new Date()
  console.log("EE",today.getFullYear(), today.getMonth()+1, today.getDate() + 1)
    if (
      parseInt(day) != tempDay ||
      parseInt(month) != tempMonth ||
      parseInt(year) != tempYear
    ) {
        
      tempDay = parseInt(day);
      tempMonth = parseInt(month);
      tempYear = parseInt(year);
      if(today.getFullYear() == tempYear && today.getMonth()+1 == parseInt(tempMonth) && today.getDate() == tempDay){
        return <h5>Today</h5>
      }
      else if(today.getFullYear() == tempYear && today.getMonth()+1 == parseInt(tempMonth) && today.getDate()-1 == tempDay){
        return <h5>Yesterday</h5>
      }

      return <h5>{`${tempDay}. ${tempMonth}. ${tempYear}.`}</h5>
    }
   
    
  }

export default EpochToDate;
