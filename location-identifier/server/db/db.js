var mysql = require('mysql');

//connection
var createConnection = () => {
    return mysql.createConnection({
        host: '35.197.150.36',
        port: 3306,
        user: 'root',
        password: 'dbrealtime',
        database: 'dbrealtime'
    });
}

exports.pool = mysql.createPool({
    host: '35.197.150.36',
    port: 3306,
    user: 'root',
    password: 'dbrealtime',
    database: 'dbrealtime'
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