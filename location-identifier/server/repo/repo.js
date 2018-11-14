var db = require('../db/db');

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
    var sql=`update requests set Status='${request.Status}', CurCoordinates='{"lat": "${request.CurCoordinates.lat}", "lng": "${request.CurCoordinates.lng}"}' where Id = ${request.Id}`;
    if (request.NewCoordinates) {
        sql=`update requests set Status='${request.Status}', NewCoordinates='{"lat": "${request.NewCoordinates.lat}", "lng": "${request.NewCoordinates.lng}"}', NewAddress= '${request.NewAddress}' where Id = ${request.Id}`;
    }
    return db.load(sql);
}
