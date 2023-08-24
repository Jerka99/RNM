const epochToDate = (epoch) =>{
        var date = new Date(epoch*1000);
        var year = date.getFullYear();
        var month = ("0"+(date.getMonth()+1)).substr(-2);
        var day = ("0"+date.getDate()).substr(-2);
        var hour = ("0"+date.getHours()).substr(-2);
        var minutes = ("0"+date.getMinutes()).substr(-2);
        var seconds = ("0"+date.getSeconds()).substr(-2);
    
        return(year+"-"+month+"-"+day+" "+hour+":"+minutes+":"+seconds) 
}

export default epochToDate