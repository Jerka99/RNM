const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const pool = require("../database");
const secretKey = 'secret-key'

router.get("/logout", (req, res) => {
  const sql = `DELETE FROM sessions WHERE session_id = '${req.sessionID}';`;
  res.clearCookie("userId", {
    domain: process.env.BACKEND_DOMAIN,
    path: "/",
    sameSite: "none",
    secure: true,
  });
  pool.query(sql, (err, data) => {
    if (err) {
      res.send({ err: err });
    } else {
      res.send({ message: "You re logged out", data });
    }
  });
});

router.get("/login", (req, res) => {
  console.log("CHECK SESSION", req.session);

  if (req.session.user) {
    res.send({ loggedIn: true, user: req.session.user });
  } else {
    res.send({ loggedIn: false });
  }
});

router.post("/login", (req, res) => {
  const [email, password] = Object.values(req.body);
  const sql = `SELECT * FROM userstable WHERE email = "${email}";`;
  
  // jwt.verify(token, secretKey, (err, decoded) => {
  //   if (err) {
  //     return res.status(401).json({ message: 'Token is invalid' });
  //   }

  //   // Here, 'decoded' will contain the user's information, including the ID
  //   console.log('22222',decoded);
  // });
  
  pool.query(sql, (err, data) => {
    if (err) {
      res.send({ err: err });
    } else {
      if (data.length > 0) {
        bcrypt.compare(password, data[0].password, (herror, response) => {
          if (response) {
            console.log("CHECK SESSION ON LOGIN", data);
            req.session.user = data;
            console.log("CHECK SESSION", req.session);
            const {id, password, ...rest} = data[0]
            const token = jwt.sign({...rest}, secretKey, { expiresIn: '1h' });
            console.log('token',token)
            res.send({...rest, token});
          } else {
            res.send({ message: "Wrong password" });
          }
        });
      } else {
        res.send({ message: "User doesn't exist" });
      }
    }
  });
});

module.exports = router;
