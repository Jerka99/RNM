const express = require("express");
const router = express.Router();
const pool = require("../database");

router.post("/", (req, res) => {
  console.log("post");
  const sql = {
    sender:
      "INSERT INTO relations (`sender`, `receiver`, `status`, `accepted`) VALUES (?, ?, ?, ?)",
    reciver:
      "INSERT INTO relations (`receiver`, `sender`, `status`, `accepted`) VALUES (?, ?, ?, ?)",
  };
  const { sender, receiver, status, accepted } = req.body;
  const statusArr = [status, accepted];

  Object.values(sql).forEach((el, i) => {

    pool.query(
      el,
      [sender, receiver, statusArr[i], accepted],
      (err, data) => {
        if (err) res.send({ err });

        return i == 1 && res.send({ data });
      }
    );
  });
});

router.patch("/", (req, res) => {
  console.log("patch");

  const { sender, receiver, status, accepted } = req.body;
  const sql = `UPDATE relations SET status = ?, accepted = ? WHERE (sender=? AND receiver=?) OR (receiver=? AND sender=?)`;

  pool.query(
    sql,
    [status, accepted, sender, receiver, sender, receiver],
    (err, data) => {
      if (err) {
        res.send({ err });
      }

      res.send({ data, accepted: accepted });
    }
  );
});

router.delete("/", (req, res) => {

  const { sender, receiver } = req.body;
  const sql = `DELETE FROM relations WHERE (sender=? AND receiver=?) OR (receiver=? AND sender=?)`;

  pool.query(sql, [sender, receiver, sender, receiver], (err, data) => {
    if (err) {
      res.send({ err });
    }

    res.send(data);
  });
});

module.exports = router;
