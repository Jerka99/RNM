const express = require("express");
const router = express.Router();
const pool = require("../database");

router.post("/leftchat", (req, res) => {

    sql =
      "SELECT sender, receiver, message, time FROM messages WHERE (sender = ? AND receiver = ?) OR (receiver = ? AND sender = ?) ORDER BY time ASC";

  pool.query(sql, VALUES, (err, data) => {
    if (err) console.log(err);
// console.log(data)
    return res.send(data);
  });
});

router.post("/messagesnumber", (req, res) => {

  sql =
      `SELECT sender, COUNT(*) FROM messages WHERE receiver = '${req.body[0]}' GROUP BY sender;`

  pool.query(sql, (err, data) => {
    if (err) console.log(err);
// console.log(data)
    return res.send(data);
  });
});

module.exports = router;
