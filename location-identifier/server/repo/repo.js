var db = require('../db/db');

exports.add = request => {
    var sql = `insert into requests (Name, Phone, Address, Note) values('${request.Name}', '${request.Phone}', '${request.Address}', '${request.Note}', '${request.Status}')`;
    return db.save(sql);
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

exports.update = request => {
    var sql=`update requests set Name='${request.Name}', Phone='${request.Phone}', Address='${request.Address}', Note='${request.Note}',Status='${request.Status}' where Id = ${request.Id}`;
    return db.save(sql);
}
