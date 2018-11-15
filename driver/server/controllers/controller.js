var express = require('express');
var userRepo = require('../repo/userRepo');
var router = express.Router();

router.post('/curpos', (req, res) => {
    var id= req.body.id;
    var pos=req.body.curpos;
    console.log(pos);
    var user = userRepo.single(id);
    Promise.all([user]).then(([row]) => {
      
        row.Coordinates = pos;
        console.log(row);
        userRepo.update(row);
        res.statusCode = 200;
        res.cookie('driver', row);
        res.json({"Coordinates": row.Coordinates});
        
    })
})

//update status
router.post('/status', (req, res) => {
    var id = req.body.id;
    var status = req.body.status;
    console.log(id)
    var user = userRepo.single(id);
    Promise.all([user]).then(([row]) => {
        row.Status = status;
        userRepo.update(row);
        res.statusCode = 200;
        res.cookie('driver', row);
        res.json({"status": row.Status});
    })
})

module.exports = router;