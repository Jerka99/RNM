const capitalize = (x = "") =>{

    return (x.substring(0,1).toUpperCase() +
     x.substring(1).toLowerCase())
}

export default capitalize;