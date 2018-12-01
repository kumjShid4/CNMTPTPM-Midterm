var express = require('express');
var repo = require('../repo/repo');
var router = express.Router();

router.post('/', (req, res) => {
    var request = req.body;
    repo.addRequest(request);
    res.redirect('/');
});

module.exports = router;