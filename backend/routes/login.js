const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const pool = require("../database");
const secretKey = "secret-key";


router.get("/login", (req, res) => {
  const token = req.headers.authorization;

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      res.send({ message: "Token is invalidd" });
    }
    else res.send(decoded);
    // Here, 'decoded' will contain the user's information, including the ID
    
  });
});

router.post("/login", (req, res) => {
  const [email, password] = Object.values(req.body);
  const sql = `SELECT * FROM userstable WHERE email = "${email}";`;

  pool.query(sql, (err, data) => {
    if (err) {
      res.send({ err: err });
    } else {
      if (data.length > 0) {
        bcrypt.compare(password, data[0].password, (herror, response) => {
          if (response) {
            const { id, password, ...rest } = data[0];
            const token = jwt.sign({ ...rest }, secretKey, { expiresIn: "24h" });

            res.send({token});
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
