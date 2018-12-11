var express = require('express');
var userRepo = require('../repo/userRepo');
var router = express.Router();
var repo = require('../repo/repo');

//update driver status and request status
router.post('/received', (req, res) => {
    var idReq = req.body.idReq;
    var idDriver = req.body.idDriver;
    var pos = req.body.curpos;
    userRepo.single(idDriver).then(user => {
        user.Status = "Busy";
        repo.singleRequest(idReq).then(request => { 
            request.Status = "Đã nhận xe";
            request.DriverId = idDriver;
            repo.updateReqReceived(request);
        });
        user.Coordinates = pos;
        userRepo.updateDriver(user);

        res.statusCode = 200;
        res.json({ "msg": "ok" });
    });
});

//update driver coordinate
router.post('/curpos', (req, res) => {
    var id = req.body.id;
    var pos = req.body.curpos;
    var user = userRepo.single(id);
    Promise.all([user]).then(([row]) => {
        row.Coordinates = pos;
        userRepo.updateDriver(row);
        res.statusCode = 200;
        res.cookie('driver', row);
        res.json({ "Coordinates": row.Coordinates });
    });
});

//update driver status
router.post('/status', (req, res) => {
    var id = req.body.id;
    var status = req.body.status;
    var pos = req.body.curpos;
    var user = userRepo.single(id);
    Promise.all([user]).then(([row]) => {
        row.Status = status;
        row.Coordinates = pos;
        userRepo.updateDriver(row);
        res.statusCode = 200;
        res.cookie('driver', row);
        res.json({ "status": row.Status });
    });
});

//update driver status
router.post('/reqStatus', (req, res) => {
    var id = req.body.id;
    var status = req.body.status;
    repo.singleRequest(id).then(request => { 
        request.Status = status;
        repo.updateReqReceived(request);
        res.statusCode = 200;
        res.json({ "msg": "ok" });
    });
});

module.exports = router;