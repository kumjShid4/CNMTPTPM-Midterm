var express = require('express');
var router = express.Router();
var sendRequest = require('request');
var request = [];
var pool = require('../db/db').pool;
var repo = require('../repo/repo');

function realtime() {
    pool.getConnection(function (err, connection) {
        // Use the connection
        connection.query('SELECT * FROM requests', function (error, results, fields) {
            request = results;
            connection.release();

            // Handle error after the release.
            if (error) throw error;

            // Don't use the connection here, it has been returned to the pool.
        });
    });
}

//get request
router.get('/', (req, res) => {
    realtime();
    var id = 0;
    if (req.query.id) {
        id = +req.query.id;
    }
    var loop = 0;
    var fn = () => {
        var requests = request.filter(r => r.Id > id);
        var max_id = Math.max.apply(Math, requests.map(function (o) {
            return o.Id;
        }));
        if (requests.length > 0) {
            res.statusCode = 200;
            res.json({ max_id, requests });
        } else {
            loop++;
            console.log(`loop: ${loop}`);
            if (loop < 2) {
                setTimeout(fn, 2500);
            } else {
                res.statusCode = 204;
                res.end('no data');
            }
        }
    };
    fn();
});

//định vị request
router.post('/update', (req, res) => {
    var id = null;
    var address = req.body.address;
    var newAddress = req.body.newAddress;
    if (req.body.id) {
        id = +req.body.id;
    }
    if (request.some(r => r.Id === id)) {
        var obj = request.find(x => x.Id === id);
        if (obj.Status === "Chưa định vị") {
            obj.Status = "Đã định vị";
            if (address != null) {
                getCoordinates(address, function (location) {
                    if (location) {
                        obj.CurCoordinates = location;
                        repo.updateRequest(obj);
                    }
                    else {
                        res.statusCode = 404;
                        res.json({ "status": "not found coordinates" });
                    }
                });
            }
        }
        if (newAddress != null) {
            getCoordinates(newAddress, function (location) {
                if (location) {
                    obj.NewCoordinates = location;
                    obj.NewAddress = newAddress;
                    repo.updateRequest(obj);
                }
                else {
                    res.statusCode = 404;
                    res.json({ "status": "not found coordinates" });
                }
            });
        }
        res.statusCode = 200;
        res.json({ "id": id, "status": "ok" });
    }
    else {
        res.statusCode = 404;
        res.json({ "status": "not found" });
    }
});

function getCoordinates(address, callback) {
    address = address.replace(" ", "+"); // replace all the white space with "+" sign to match with google search pattern
    apiKey = "AIzaSyBBYBMYaUEnQ9A42480K33UWa3uuN0dN4E";
    var options = {
        uri: 'https://maps.googleapis.com/maps/api/geocode/json?',
        method: 'POST',
        json: true,
        body: address,
        qs: {
            address: address,
            key: apiKey
        }
    };
    sendRequest(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // var info = JSON.parse(body);
            callback(body.results[0].geometry.location);
        } else {
            console.log(error);
        }
    });
}

//get request
router.get('/getExistDataChanged', (req, res) => {
    realtime();
    var id = req.query.id;
    var newData = request.filter(r => r.Id <= id);
    res.statusCode = 200;
    res.json({newData : newData});
});

module.exports = router;