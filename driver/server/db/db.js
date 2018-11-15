var mysql = require('mysql');

var createConnection = () => {
    return mysql.createConnection({
        host: '35.197.150.36',
        port: 3306,
        user: 'root',
        password: 'dbrealtime',
        database: 'dbrealtime'
    });
}

exports.load = sql => {
    return new Promise((resolve, reject) => {
        var connection = createConnection();
        connection.connect((err) => {
            if (err) {
                console.error('error connecting: ');
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

exports.insert = sql => {
    return new Promise((resolve, reject) => {
        var connection = createConnection();
        connection.connect((err) => {
            if (err) {
                console.error('error connecting: ' + err.stack);
                return;
            }
        });
        connection.query(sql, (err, value) => {
            if (err) {
                reject(err);
            } else {
                resolve(value);
            }

            connection.end();
        });
    });
}