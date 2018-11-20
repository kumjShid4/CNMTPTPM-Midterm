var express = require('express'),
    repo = require('../repo/repo'),
    userRepo = require('../repo/userRepo'),
    datetime = require('date-and-time');

var router = express.Router();

var requestReceived = [];

// Get requests
router.get('/', (req, res) => {
    repo.loadAllDecTime()
        .then(rows => {
            for (var i = 0; i < rows.length; i++) {
                rows[i].CreatedTime = datetime.format(new Date(rows[i].CreatedTime), 'DD-MM-YYYY HH:mm:ss');
            }
            
            res.json({
                requests: rows,
                isAll: true
            });
        }).catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.end('View error log on console');
        })
})

// Xử lý request
router.get('/receiving', (req, res) => {
    var loop = 0;
    var fn = () => {
        if (requestReceived.length > 0) {
            var request = requestReceived;
            requestReceived = [];

            userRepo.loadDriverID(request[0].DriverId)
            .then(row => {
                request[0].DriverId = row[0];
                res.json({
                    requests: request,
                    isAll: false
                })
            }).catch(err => {
                console.log(err);
                request[0].DriverId = null;
                res.json({
                    requests: request,
                    isAll: false
                })
            })
        } else {
            loop++;
            console.log(`loop: ${loop}`);
            if (loop < 4) {
                setTimeout(fn, 2500);
            } else {
                res.statusCode = 204;
                res.end('No data');
            }
        }
    }

    fn();
})

// Nhận 1 request
router.post('/', (req, res) => {
    requestReceived = req.body;
    res.redirect('/');
})

module.exports = router;