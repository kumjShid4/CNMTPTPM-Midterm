var express = require('express');
var datetime = require('date-and-time');
var router = express.Router();
var request = [];

//get request
router.get('/', (req, res) => {
    var id = 0;
    if (req.query.id) {
        id = +req.query.id;
    }

    var loop = 0;
    var fn = () => {
        var requests = request.filter(r => r.id > id);
        console.log(requests.length)
        var max_id = request.length;
        if (requests.length > 0) {
            res.json({
                max_id,
                requests
            });
        } else {
            loop++;
            console.log(`loop: ${loop}`);
            if (loop < 4) {
                setTimeout(fn, 2500);
            } else {
                res.statusCode = 204;
                res.end('no data');
            }
        }
    }

    fn();
})

//nhận request
router.post('/', (req, res) => {
    var data = req.body;
    data['id'] = request.length + 1; //id
    data['thoigiannhan'] = datetime.format(new Date(), 'DD-MM-YYYY, HH:mm:ss');
    data['trangthai'] = "Chưa định vị";
    data["diachimoi"] = null;
    request.push(data);
    console.log(data);
    res.statusCode = 200;
    res.json({ 'a': "ok" });
})

//định vị request
router.post('/update', (req, res) => {
    var id = null;
    if (req.body.id) {
        id = +req.body.id;
    }
    if (request.some(r => r.id === id)) {
        if (request[id - 1]['trangthai'] === "Chưa định vị")
        {
            request[id - 1]['trangthai'] = "Đã định vị";
        }
        res.statusCode = 200;
        res.json({ "id": id, "status": "ok" });
    }
    else {
        res.statusCode = 404;
        res.json({"status": "not found"});
    }
})

module.exports = router;