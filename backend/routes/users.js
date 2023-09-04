const express = require("express");
const router = express.Router();
// SELECT name, secondname, email, receiver, sender, status
//   FROM relations JOIN usersbase ON usersbase.email = relations.receiver WHERE (name LIKE "%${req.body[0]}%" OR secondname LIKE "%${req.body[0]}%") AND (sender = '${req.body[1]}' OR receiver = '${req.body[1]}')
//    UNION SELECT name, secondname, email, receiver, sender, status FROM usersbase LEFT JOIN relations ON usersbase.email = relations.sender WHERE (name LIKE "%${req.body[0]}%" OR secondname LIKE "%${req.body[0]}%") AND email != '${req.body[1]}' AND sender IS NULL 
const connection = require("../database");

const uniqueUsersFun = (arr) => {
  const uniqueEl = [];
  const checkEl = (x) => {
    const found = uniqueEl.some((e) => e.email === x);
    return found;
  };

  arr.forEach((element) => {
    if (!checkEl(element.email)) {
      uniqueEl.push(element);
    }
  });
  return uniqueEl;
};

router.post("/", (req, res) => {

  const sql = `WITH previous_query as (SELECT * FROM relations limit 0)
  SELECT name, secondname, email, receiver, sender, status, accepted FROM (
  SELECT * FROM usersbase 
  LEFT JOIN relations ON usersbase.email = relations.sender
   WHERE sender IS NOT null AND receiver = '${req.body[1]}'
  UNION
  SELECT * FROM usersbase 
  LEFT JOIN previous_query ON usersbase.email = previous_query.sender)as a WHERE (name LIKE "%${req.body[0]}%" OR secondname LIKE "%${req.body[0]}%") AND email != '${req.body[1]}'`;
  connection.query(sql, (err, data) => {
    if (err) console.log(err);

    return res.send(uniqueUsersFun(data));
  });
});

module.exports = router;
