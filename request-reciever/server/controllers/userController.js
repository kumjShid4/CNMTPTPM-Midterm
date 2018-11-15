var express = require('express'),
    MD5 = require('crypto-js/md5');

var userRepo = require('../repo/userRepo');
var authRepo = require('../repo/authRepo');
var router = express.Router();

//register
router.post('/register', (req, res) => {
    var user = {
        Username: req.body.Username,
        Password: MD5(req.body.Password).toString(),
        Name: req.body.Name,
        Email: req.body.Email,
        Phone: req.body.Phone
    };
    userRepo.add(user).then(value => {
        res.statusCode = 200;
        res.json({ "msg": "register successfully" });
    });
});

//login
router.post('/login', (req, res) => {
    var user = {
        Username: req.body.Username,
        Password: MD5(req.body.Password).toString()
    };
    userRepo.login(user).then(rows => {
        if (rows.length > 0) {
            var userEntity = rows[0];
            var acToken = authRepo.generateAccessToken(userEntity);
            var rfToken = authRepo.generateRefreshToken();

            //refresh token
            authRepo.updateRefreshToken(userEntity.Id, rfToken)
                .then(value => {
                    //set token, name, auth vào cookie
                    res.cookie('user_token', acToken);
                    res.cookie('user_name', userEntity.Name);
                    res.cookie('user_auth', true);
                    res.json({
                        auth: true,
                        user: userEntity,
                        access_token: acToken,
                        refresh_token: rfToken
                    })
                })
                .catch(err => {
                    console.log(err);
                    //remove token, name trong cookie
                    //set auth = false
                    res.cookie('user_token', '', {expires: new Date(0)});
                    res.cookie('user_name', '', {expires: new Date(0)});
                    res.cookie('user_auth', false);
                    res.statusCode = 500;
                    res.end('View error log on console');
                })
        } else {
            //remove token, name trong cookie
            //set auth = false
            res.cookie('user_token', '', {expires: new Date(0)});
            res.cookie('user_name', '', {expires: new Date(0)});
            res.cookie('user_auth', false);
            res.statusCode = 401;
            res.json({
                auth: false
            })
        }
    });
});

//logout
router.post('/logout', (req, res) => {
    res.statusCode = 204;
    res.json({"msg": "logout succesfully"});
});

module.exports = router;