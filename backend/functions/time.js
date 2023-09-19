
const time = () =>{
    const date = new Date();
    return Math.round(date/1000)
}

time()
module.exports = {time}