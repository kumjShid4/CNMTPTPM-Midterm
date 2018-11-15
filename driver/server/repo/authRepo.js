var jwt = require('jsonwebtoken');
var rndToken = require('rand-token');
var moment = require('moment');

var db=require('../db/db');

const SECRECT = 'QWERTY_WANNASMILE';
const AC_LIFETIME = 300;

exports.generateAccessToken = userEntity=> {
    var payload= {
        user: userEntity,
        info: 'more info'
    }

    var token = jwt.sign(payload, SECRECT,{
        expiresIn: AC_LIFETIME
    });
    return token;
}

exports.verifyAccessToken = (req, res,next) => {
    var token = req.headers['x-access-token'];
    console.log(token);
    if (token) {
        jwt.verify(token, SECRECT, (err,payload )=> {
            if (err) {
                res.statusCode = 401; 
                //Similar to 403 Forbidden, but specifically for use when authentication is required and has failed or has not yet been provided. 
                res.json({
                    msg:'INVALID TOKEN',
                    errer:err
                })
            } else {
                req.token.payload = payload;
                next();
            }
        });
    } else {
        res.statusCode=403; //forbiden The user might not have the necessary permissions for a resource, or may need an account of some sort
        res.json({
            msg: 'NO_TOKEN'
        })
    }
}

exports.generateRefreshToken = () => {
    const SIZE=80;
    return rndToken.generate(SIZE);
}

exports.updateRefreshToken= (userId, rfToken) => {
    return new Promise((resolve, reject) => {

        var sql = `delete from refreshtoken where userId = ${userId} and userType=4`;
        db.insert(sql) // delete
            .then(value => {
                var rdt = moment().format('YYYY-MM-DD HH:mm:ss');
                sql = `insert into refreshtoken(userId, userType, rftoken, rtd) values(${userId},4, '${rfToken}', '${rdt}')`;
                return db.insert(sql);
            })
            .then(value => resolve(value))
            .catch(err => reject(err));
    });
}