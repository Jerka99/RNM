const express = require("express");
const router = express.Router();
const connection = require("../database");

router.post("/", (req, res) => {

  let VALUES = [];
  let sql = "";
  if (Object.values(req.body).length == 2) {
    VALUES = Object.values(req.body);
    VALUES.push(VALUES[0], VALUES[1])
    sql =
      "SELECT sender, receiver, message, time FROM messages WHERE (sender = ? AND receiver = ?) OR (receiver = ? AND sender = ?) ORDER BY time ASC";
  } else {
    const { epoch, message, recipientEmail, sender } = req.body;
    VALUES.push(sender, recipientEmail, message, epoch)
    sql =
      "INSERT INTO messages (`sender`, `receiver`, `message`, `time`) VALUES (?, ?, ?, ?)";
  }

  connection.query(sql, VALUES, (err, data) => {
    if (err) console.log(err);
console.log(data)
    return res.send(data);
  });
});

module.exports = router;
