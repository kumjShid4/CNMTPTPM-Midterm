var jwt = require('jsonwebtoken');
var rndToken = require('rand-token');
var moment = require('moment');

var db = require('../db/db');

const SECRET = 'ABCDEF';
const AC_LIFETIME = 600; // seconds

exports.generateAccessToken = userEntity => {
    var payload = {
        user: userEntity,
        info: 'more info'
    };

    var token = jwt.sign(payload, SECRET, {
        expiresIn: AC_LIFETIME
    });

    return token;
};

exports.verifyAuthenticationUser = (req, res, next) => {
    var token = req.cookies.user_token;
    if (token) {
        jwt.verify(token, SECRET, (err, payload) => {
            if (err) {
                res.statusCode = 401;
                res.json({
                    msg: 'INVALID TOKEN',
                    error: err
                });
            } else {
                req.token_payload = payload;
                next();
            }
        });
    } else {
        res.statusCode = 403;
        res.json({
            msg: 'NO_TOKEN'
        });
    }
};

exports.verifyAuthenticationIdentifier = (req, res, next) => {
    var token = req.cookies.identifier_token;
    if (token) {
        jwt.verify(token, SECRET, (err, payload) => {
            if (err) {
                res.statusCode = 401;
                res.json({
                    msg: 'INVALID TOKEN',
                    error: err
                });
            } else {
                req.token_payload = payload;
                next();
            }
        });
    } else {
        res.statusCode = 403;
        res.json({
            msg: 'NO_TOKEN'
        });
    }
};

exports.verifyAuthenticationManager = (req, res, next) => {
    var token = req.cookies.manager_token;
    if (token) {
        jwt.verify(token, SECRET, (err, payload) => {
            if (err) {
                res.statusCode = 401;
                res.json({
                    msg: 'INVALID TOKEN',
                    error: err
                });
            } else {
                req.token_payload = payload;
                next();
            }
        });
    } else {
        res.statusCode = 403;
        res.json({
            msg: 'NO_TOKEN'
        });
    }
};

exports.verifyAuthenticationDriver = (req, res, next) => {
    var token = req.cookies.driver_token;
    if (token) {
        jwt.verify(token, SECRET, (err, payload) => {
            if (err) {
                res.statusCode = 401;
                res.json({
                    msg: 'INVALID TOKEN',
                    error: err
                });
            } else {
                req.token_payload = payload;
                next();
            }
        });
    } else {
        res.statusCode = 403;
        res.json({
            msg: 'NO_TOKEN'
        });
    }
};

exports.generateRefreshToken = () => {
    const SIZE = 80;
    return rndToken.generate(SIZE);
};

exports.updateRefreshToken = (userId, rfToken) => {
    return new Promise((resolve, reject) => {
        var sql = `delete from refreshtoken where userId = ${userId}`;
        db.insert(sql) // delete
            .then(value => {
                var rdt = moment().format('YYYY-MM-DD HH:mm:ss');
                sql = `insert into refreshtoken(userId, rftoken, rtd) values(${userId}, '${rfToken}', '${rdt}')`;
                return db.insert(sql);
            })
            .then(value => resolve(value))
            .catch(err => reject(err));
    });
};