var db = require('../db/db');

exports.add = request => {
    var sql = `insert into requests (Name, Phone, Address, Note, Status) values('${request.Name}', '${request.Phone}', '${request.Address}', '${request.Note}', '${request.Status}')`;
    return db.insert(sql);
}

exports.single = id => {
    return new Promise((resolve, reject) => {
        var sql = `select * from requests where Id = ${id}`;
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

