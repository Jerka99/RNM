const express = require('express')
const router = express.Router();

const bcrypt = require("bcrypt");
const connection = require("../database");
const bodyParser = require("body-parser");

const cookieParser = require("cookie-parser");

router.use(cookieParser());
router.use(bodyParser.urlencoded({ extended: true }));

router.get("/logout", (req, res)=>{
  res.clearCookie("userId");
  res.send({message:"You re logged out"});  
})

router.get("/login", (req, res) => {

  if(req.session.user){
      res.send({loggedIn:true, user:req.session.user})
    }
    else{
      res.send({loggedIn:false})
    }
  });
  
  router.post("/login", (req, res) => {

    const [email, password] = Object.values(req.body);
    const sql = `SELECT * FROM userstable WHERE email = "${email}";`;
  
    connection.query(sql, (err, data) => {
      if (err) {
        res.send({ err: err });
      } else {
        if (data.length > 0) {
          bcrypt.compare(password, data[0].password, (herror, response) => {
            if (response) {
              req.session.user = data;
              res.send(data);
            } else {
              res.send({ message: "Wrong password" });
            }
          });
        } else {
          res.send({ message: "User doesn't exists" });
        }
      }
    });
  });

module.exports = router