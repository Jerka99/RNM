const express = require("express");
const axios = require("axios");

const router = express.Router();

const { validationResult } = require("express-validator");
const expressvalidation = require("../expressValidationObject");
const pool = require("../database");
const bcrypt = require("bcrypt");
const saltRounds = 10;

router.post("/", Object.values(expressvalidation), (req, res) => {
  const errors = validationResult(req);
  const sql =
    "INSERT INTO userstable (`email`, `password`, `name`, `secondname`) VALUES (?)";
  const { passwordConfirmation, ...rest } = req.body;

  bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
    rest.password = hash;
    const values = Object.values(rest);
    console.log(values);

    if (!errors.isEmpty()) {
      return res.send({ errors: errors.array() });
    } else {
      pool.query(sql, [values], async (err, data) => {
        if (err) {
          if (err.errno == 1062) {
            return res.send({
              errors: [{ msg: "E-mail already in use", path: "email" }],
            });
          } else {
            console.log(err);
          }
        } else {
          try {


            const postData1 = {
              sender: rest.email,
              receiver: "test@gmail.com",
              status: 1,
              accepted: 1,
            };
            const postData2 = {
              epoch: Math.floor(Date.now() / 1000),
              message:
                "Hello, I'm here to assist you immediately after you've registered to make it easier for you to test chat. If you'd like, you can open an incognito tab and log in to this account using the following credentials: Email: test@gmail.com Password: 123456",
              recipientEmail: rest.email,
              sender: "test@gmail.com",
            };



            const [response1, response2] = await Promise.all([
              axios.post(`${process.env.BACKEND_URL}/relations`, postData1),
              axios.post(`${process.env.BACKEND_URL}/messages`, postData2),
            ]);


            if (response1.status === 200 && response2.status === 200) {
              const data1 = response1.data;
              const data2 = response2.data;
              console.log({ data1, data2 });
            } else {
              // Handle errors here
              console.log({ error: "Failed to fetch data" });
            }
          } catch (error) {
            // Handle any unexpected errors
            console.log({ error: "An error occurred" });
          }
          return res.send(data);
        }
      });
    }
  });
});

module.exports = router;
