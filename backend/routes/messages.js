const express = require("express");
const router = express.Router();
const pool = require("../database");

router.post("/messages", (req, res) => {

  let VALUES = [];
  let sql = "";
  if (Object.values(req.body).length == 2) {
    VALUES = Object.values(req.body);
    VALUES.push(VALUES[0], VALUES[1])
    sql =
      "SELECT sender, receiver, message, time, status FROM messages WHERE (sender = ? AND receiver = ?) OR (receiver = ? AND sender = ?) ORDER BY time ASC";
  } else {
    const { epoch, message, recipientEmail, sender } = req.body;
    VALUES.push(sender, recipientEmail, message, epoch)
    sql =
      "INSERT INTO messages (`sender`, `receiver`, `message`, `time`) VALUES (?, ?, ?, ?)";
  }
  console.log('dataaaaa',VALUES)

  pool.query(sql, VALUES, (err, data) => {
    if (err) console.log(err);

    return res.send(data);
  });
});

router.patch("/messages", (req, res) => {
  if(req.body.sender){
    const { sender, receiver, status } = req.body;
    const sql =
    "UPDATE messages SET status =? WHERE sender=? AND receiver=? AND (status IS NULL OR status = 1)";
    pool.query(sql, [status, sender, receiver], (err, data) => {
      if (err) console.log(err);
  // console.log(data)
      return res.send(data);
    });
  }
  else{
    const { receiver, status } = req.body;
    const sql =
    "UPDATE messages SET status =? WHERE receiver=? AND (status IS NULL)";
    pool.query(sql, [status, receiver], (err, data) => {
      if (err) console.log(err);
  // console.log(data)
      return res.send(data);
    });
  }
});


router.post("/messagesnumber", (req, res) => {
  sql =
      `WITH query1 as (SELECT email, lastActivity FROM users.relations 
        JOIN users.userstable ON relations.receiver = userstable.email
         WHERE accepted = 1 AND sender = '${req.body.receiver}' ORDER BY userstable.name ASC),
         query2 as (SELECT sender, COUNT(*) as "unreadMessages" FROM users.messages
         WHERE receiver = '${req.body.receiver}' AND (status IS NULL OR status = 1) GROUP BY sender)
        
        SELECT email, unreadMessages, lastActivity FROM query1 LEFT JOIN query2 ON query1.email = query2.sender;
        `

  pool.query(sql, (err, data) => {
    if (err) res.send(err);

    return res.send(data);
  });
});

module.exports = router;
