const express = require('express')
const router = express.Router();

const { validationResult } = require("express-validator");
const expressvalidation = require("../expressValidationObject");
const connection = require("../database");
const bcrypt = require("bcrypt");
const saltRounds = 10;


router.post("/", Object.values(expressvalidation), (req, res) => {
    const errors = validationResult(req);
    const sql =
      "INSERT INTO usersbase (`email`, `password`, `name`, `secondname`) VALUES (?)";
    const { passwordConfirmation, ...rest } = req.body;
  
    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
      rest.password = hash;
      const values = Object.values(rest);
  
      if (!errors.isEmpty()) {
        return res.send({ errors: errors.array() });
      } else {
        connection.query(sql, [values], (err, data) => {
          if (err) {
            if (err.errno == 1062) {
              return res.send({errors:[{msg:"E-mail already in use", path:'email'}]});
            } else {
              console.log(err);
            }
          } else {
            return res.send(data);
          }
        });
      }
    });
  });

  module.exports = router