var express = require('express');
var userRepo = require('../repo/userRepo');
var router = express.Router();
var pool = require('../db/db').pool;
var haversine = require('haversine');
var repo = require('../repo/repo');
var request = [];

router.get('/', (req, res) => {
    var requests = repo.getAllIdentifiedRequest();
    Promise.all([requests]).then(([rows]) => {
        var id = 0;
        var distance = 0;
        rows.forEach(eReq => {
            var coordReq = JSON.parse(eReq.CurCoordinates);
            coordReq.latitude = parseFloat(coordReq.lat);
            coordReq.longitude = parseFloat(coordReq.lng);
            var driver = userRepo.getAllReady();
            Promise.all([driver]).then(([driverRows]) => {
                driverRows.forEach(eDri => {
                    var coordDriver = JSON.parse(eDri.Coordinates);
                    coordDriver.latitude = parseFloat(coordDriver.lat);
                    coordDriver.longitude = parseFloat(coordDriver.lng);
                    id = eDri.Id;
                    distance = haversine(coordReq, coordDriver, {unit: 'meter'});
                    if (haversine(coordReq, coordDriver, {unit: 'meter'}) < distance) {
                        distance = haversine(coordReq, coordDriver, {unit: 'meter'});
                        id = eDri.Id;
                    }
                })
            }) 
        });
        console.log(id);
        console.log(distance)
    })
})

router.post('/curpos', (req, res) => {
    var id= req.body.id;
    var pos=req.body.curpos;
    var user = userRepo.single(id);
    Promise.all([user]).then(([row]) => {
        row.Coordinates = pos;
        userRepo.updateDriver(row);
        res.statusCode = 200;
        res.cookie('driver', row);
        res.json({"Coordinates": row.Coordinates});
        
    })
})

//update status
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
        res.json({"status": row.Status});
    })
})


module.exports = router;