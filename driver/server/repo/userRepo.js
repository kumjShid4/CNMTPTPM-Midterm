var db = require('../db/db');

var md5 = require('crypto-js/md5');

exports.add = userEntity => {
    var sql = `insert into driver(Name, Phone, Email, Username, Password, License) values('${userEntity.Name}','${userEntity.Phone}','${userEntity.Email}',  '${userEntity.Username}', '${userEntity.Password}', '${userEntity.License}')`;
    return db.insert(sql);
}

exports.login = userEntity => {
    var sql = `select * from driver where Username = '${userEntity.Username}' and Password = '${userEntity.Password}'`; 
    return db.load(sql);
}

exports.single = Id => {
    return new Promise((resolve, reject) => {
        var sql = `select * from driver where Id = ${Id}`;
        db.load(sql).then(rows => {
            if (rows.length === 0) {
                resolve(null);
            }
            else {
                resolve(rows[0]);
            }
        }).catch(err => {
            reject(err);
        });
    });
}

exports.update = userEntity => {
    var sql = `update driver set Status='${userEntity.Status}', Password='${userEntity.Password}', Name='${userEntity.Name}', Email='${userEntity.Email}', Phone='${userEntity.Phone}',License='${userEntity.License}' where Id = ${userEntity.Id}`;
    if (userEntity.Coordinates) {
     sql = `update driver set Status='${userEntity.Status}', Password='${userEntity.Password}', Name='${userEntity.Name}', Email='${userEntity.Email}', Phone='${userEntity.Phone}',License='${userEntity.License}',Coordinates='{"lat": "${userEntity.Coordinates.lat}","lng":"${userEntity.Coordinates.lng}"}'  where Id = ${userEntity.Id}`;
    } 
    return db.load(sql);
}

