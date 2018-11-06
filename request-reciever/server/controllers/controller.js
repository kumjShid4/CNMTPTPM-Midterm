var express = require('express'),
    querystring = require('querystring'),
    request = require('request'),
    http = require('http');

var repo = require('../repo/repo');
var router = express.Router();

router.post('/', (req, res) => {
    var request = req.body;
    console.log(request);
    repo.add(request);
    // request.post('http://localhost:3001/data', {
    //     json: data,
    //     headers: {
    //         'content-type': 'application/json'
    //     }
    // }, (err, response, body) => {
    //     if (err) {
    //         console.log(err);
    //     }
    // });
    res.redirect('/');
})

module.exports = router;