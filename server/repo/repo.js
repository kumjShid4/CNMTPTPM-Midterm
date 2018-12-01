var db = require('../db/db');

//request
exports.addRequest = request => {
    var sql = `insert into requests (Name, Phone, Address, Note, Status) values('${request.Name}', '${request.Phone}', '${request.Address}', '${request.Note}', '${request.Status}')`;
    return db.insert(sql);
};

exports.singleRequest = id => {
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
};

exports.updateReqStatus = request => {
    var sql=`update requests set Status='${request.Status}' where Id = ${request.Id}`;
    return db.load(sql);
};

exports.updateReqReceived = request => {
    var sql=`update requests set Status='${request.Status}', DriverId='${request.DriverId}' where Id = ${request.Id}`;
    return db.load(sql);
};


exports.updateRequest = request => {
    var sql=`update requests set Status='${request.Status}', CurCoordinates='{"lat": "${request.CurCoordinates.lat}", "lng": "${request.CurCoordinates.lng}"}' where Id = ${request.Id}`;
    if (request.NewCoordinates) {
        sql=`update requests set Status='${request.Status}', NewCoordinates='{"lat": "${request.NewCoordinates.lat}", "lng": "${request.NewCoordinates.lng}"}', NewAddress= '${request.NewAddress}' where Id = ${request.Id}`;
    }
    return db.load(sql);
};

exports.getAllIdentifiedRequest = () => {
    var sql = `select * from requests where Status = "Đã định vị"`;
    return db.load(sql);
};

exports.loadAll = () => {
    var sql = "select * from requests";
    return db.load(sql);
};

exports.loadAllDecTime = () => {
    var sql = "select * from requests order by CreatedTime DESC";
    return db.load(sql);
};


//driver
exports.loadAllDriver = () => {
    var sql = "select * from user where Permission = 3";
    return db.load(sql);
};

//get driver ready
exports.getAllReady = () => {
    var sql = `select * from user where Permission = 3 and Status = "Ready"`;
    return db.load(sql);
};