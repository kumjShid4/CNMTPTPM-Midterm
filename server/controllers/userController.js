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
        Phone: req.body.Phone,
        License: req.body.License,
        Permission: +req.body.Permission
    };
    userRepo.add(user).then(value => {
        res.statusCode = 200;
        res.json({ "msg": "register user successfully" });
    }).catch(err => {
        if (err.code == 'ER_DUP_ENTRY') {
            res.statusCode = 400;
            res.json({ "msg": "User is already exist" });
        }
    });
});

//login
router.post('/login', (req, res) => {
    var user = {
        Username: req.body.Username,
        Password: MD5(req.body.Password).toString(),
        Permission: req.body.Permission
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
                    switch (userEntity.Permission) {
                        case 0:
                            res.cookie('user_token', acToken);
                            res.cookie('user_auth', true);
                            res.cookie('user', userEntity);
                            break;
                        case 1:
                            res.cookie('identifier_token', acToken);
                            res.cookie('identifier_auth', true);
                            res.cookie('identifier', userEntity);
                            break;
                        case 2:
                            res.cookie('manager_token', acToken);
                            res.cookie('manager_auth', true);
                            res.cookie('manager', userEntity);
                            break;
                        case 3:
                            res.cookie('driver_token', acToken);
                            res.cookie('driver_auth', true);
                            res.cookie('driver', userEntity);
                            break;
                        default:
                            break;
                    }
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
                    switch (user.Permission) {
                        case 0:
                            res.cookie('user_token', '', {expires: new Date(0)});
                            res.cookie('user_auth', false);
                            res.cookie('user', '', {expires: new Date(0)});
                            break;
                        case 1:
                            res.cookie('identifier_token', '', {expires: new Date(0)});
                            res.cookie('identifier_auth', false);
                            res.cookie('identifier', '', {expires: new Date(0)});
                            break;
                        case 2:
                            res.cookie('manager_token', '', {expires: new Date(0)});
                            res.cookie('manager_auth', false);
                            res.cookie('manager', '', {expires: new Date(0)});
                            break;
                        case 3:
                            res.cookie('driver_token', '', {expires: new Date(0)});
                            res.cookie('driver_auth', false);
                            res.cookie('driver', '', {expires: new Date(0)});
                            break;
                        default:
                            break;
                    }
                    res.statusCode = 500;
                    res.end('View error log on console');
                })
        } else {
            //remove token, name trong cookie
            //set auth = false
            switch (user.Permission) {
                case 0:
                    res.cookie('user_token', '', {expires: new Date(0)});
                    res.cookie('user_auth', false);
                    res.cookie('user', '', {expires: new Date(0)});
                    break;
                case 1:
                    res.cookie('identifier_token', '', {expires: new Date(0)});
                    res.cookie('identifier_auth', false);
                    res.cookie('identifier', '', {expires: new Date(0)});
                    break;
                case 2:
                    res.cookie('manager_token', '', {expires: new Date(0)});
                    res.cookie('manager_auth', false);
                    res.cookie('manager', '', {expires: new Date(0)});
                    break;
                case 3:
                    res.cookie('driver_token', '', {expires: new Date(0)});
                    res.cookie('driver_auth', false);
                    res.cookie('driver', '', {expires: new Date(0)});
                    break;
                default:
                    break;
            }
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