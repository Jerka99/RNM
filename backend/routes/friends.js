const express = require("express");
const router = express.Router();
const connection = require("../database");

router.post("/", (req, res) => {

  const sql = `SELECT name, secondname, email FROM relations JOIN userstable ON relations.receiver = userstable.email WHERE accepted = 1 AND sender = '${req.body[0]}'`;
  connection.query(sql, (err, data) => {
    if (err) console.log(err);

    return res.send(data);
  });
});

module.exports = router;
