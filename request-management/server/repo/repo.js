var db = require('../db/db')

exports.loadAll = () => {
    var sql = "select * from requests";
    return db.load(sql);
}

exports.loadAllDecTime = () => {
    var sql = "select * from requests order by CreatedTime DESC";
    return db.load(sql);
}

exports.single = id => {
    var sql = `select * from requests where Id = ${id}`;
    return db.load(sql);
}