const express = require('express')
const router = express.Router();


router.get("/", (req, res) => {
    
      res.send({message:'connected to server'})
})

module.exports = router