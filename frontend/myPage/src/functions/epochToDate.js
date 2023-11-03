const epochToDate = (epoch, fulldate) =>{
        let date = new Date(epoch*1000);
        let year = date.getFullYear();
        let month = ("0"+(date.getMonth()+1)).substr(-2);
        let day = ("0"+date.getDate()).substr(-2);
        let hour = ("0"+date.getHours()).substr(-2);
        let minutes = ("0"+date.getMinutes()).substr(-2);
        let seconds = ("0"+date.getSeconds()).substr(-2);
        if(fulldate) return (`${day}.${month}.${year}. at ${hour}:${minutes}`)
        return(hour+":"+minutes) 
}

export default epochToDate