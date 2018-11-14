var db = require('../db/db');

exports.add = user => {
    var sql = `insert into user(Name, Phone, Email, Username, Password) values('${user.Name}', ${user.Phone}, '${user.Email}', '${user.Username}', '${user.Password}')`;
    console.log(sql)
    return db.insert(sql);
}

exports.login = user => {
    var sql = `select * from user where Username = '${user.Username}' and Password = '${user.Password}'`;
    return db.load(sql);
}


exports.single = Id => {
    return new Promise((resolve, reject) => {
        var sql = `select * from user where Id = ${Id}`;
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

exports.update = user => {
    var sql = `update user set Password='${user.Password}', Name='${user.Name}', Email='${user.Email}', Phone='${user.Phone}' where Id = ${user.Id}`;
    return db.insert(sql);
}
