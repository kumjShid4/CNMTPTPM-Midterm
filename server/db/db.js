var mysql = require('mysql');

//connection
var createConnection = () => {
    return mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'anhyeuem1997?',
        database: 'midterm'
    });
}

exports.pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'anhyeuem1997?',
    database: 'midterm'
});

exports.load = sql => {
    return new Promise((resolve, reject) => {
        var cn = createConnection();
        cn.connect((err) => {
            if (err) {
                console.error('error connecting: ');
                return;
            }
        });
        cn.query(sql, (error, rows, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(rows);
            }
            cn.end();
        });
    });
}

exports.insert = sql => {
    return new Promise((resolve, reject) => {
        var cn = createConnection();
        cn.connect((err) => {
            if (err) {
                console.error('error connecting: ' + err.stack);
                return;
            }
        });
        cn.query(sql, function (error, value) {
            if (error) {
                reject(error);
            } else {
                resolve(value);
            }
            cn.end();
        });
    });
}