var mysql = require('mysql');

exports.pool = mysql.createPool({
    host: '35.197.150.36',
    port: 3306,
    user: 'root',
    password: 'dbrealtime',
    database: 'dbrealtime'
});

exports.load = sql => {
    return new Promise((resolve, reject) => {
        var connection = mysql.createConnection({
            host: '35.197.150.36',
            port: 3306,
            user: 'root',
            password: 'dbrealtime',
            database: 'dbrealtime'
        });

        connection.connect((err) => {
            if (err) {
                console.error('error connecting: ' + err.stack);
                return;
            }
        });

        connection.query(sql, (error, rows, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(rows);
            }

            connection.end();
        });
    });
}

exports.save = sql => {
    return new Promise((resolve, reject) => {
        var connection = mysql.createConnection({
            host: '35.197.150.36',
            port: 3306,
            user: 'root',
            password: 'dbrealtime',
            database: 'dbrealtime'
        });

        connection.connect((err) => {
            if (err) {
                console.error('error connecting: ' + err.stack);
                return;
            }
        });

        connection.query(sql, function (error, value) {
            if (error) {
                reject(error);
            } else {
                resolve(value);
            }

            connection.end();
        });
    });
}