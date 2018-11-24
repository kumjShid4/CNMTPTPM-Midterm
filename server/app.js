var express = require('express'),
    http = require('http'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    cors = require('cors'),
    cookieParser = require('cookie-parser'),
    socketIO = require('socket.io');

var app = express();
var repo = require('./repo/repo');  
var receiver = require('./controllers/receiverController');
var identifier = require('./controllers/identifierController');
var manager = require('./controllers/managerController');
var driver = require('./controllers/driverController');
var userController = require('./controllers/userController');
var verifyUser = require('./repo/authRepo').verifyAuthenticationUser;
var verifyIdentifier = require('./repo/authRepo').verifyAuthenticationIdentifier;
var verifyDriver = require('./repo/authRepo').verifyAuthenticationDriver;
var verifyManager = require('./repo/authRepo').verifyAuthenticationManager;
var server = http.Server(app);
var io = socketIO(server, {path: '/app4'});
var clients = {};

app.use(cookieParser());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.sendFile('receiver.html', {
        root: __dirname + "./../client"
    });
});

app.get('/app2', (req, res) => {
    res.sendFile('identifier.html', {
        root: __dirname + "./../client"
    });
});

app.get('/app3', (req, res) => {
    res.sendFile('manager.html', {
        root: __dirname + "./../client"
    });
});

app.get('/app4', (req, res) => {
    res.sendFile('driver.html', {
        root: __dirname + "./../client"
    });
});
app.use(express.static(__dirname + "./../client"));
app.use('/receiver', verifyUser, receiver);
app.use('/identifier', verifyIdentifier, identifier);
app.use('/manager', verifyManager, manager);
app.use('/driver', verifyDriver, driver);
app.use('/user', userController);

io.on('connection', socket => {
    console.log('a driver connected');

    socket.on('join', (data) => {
        var _data = data;
        _data['socketId'] = socket.id;
        clients[socket.id] = _data;
    })
    
    socket.on('updateStatus', (data) => {
        var _data = data;
        _data['socketId'] = socket.id;
        clients[socket.id] = _data;
        console.log('update driver\'s status ...');
    })
    
    socket.on('updateCoords', (data) => {
        var _data = data;
        _data['socketId'] = socket.id;
        clients[socket.id] = _data;
        console.log('update driver\'s current coordinates ...');
    })
    
    socket.on('request', function (data) {
        var requests = repo.getAllIdentifiedRequest();
        Promise.all([requests]).then(([rows]) => {
            rows.forEach(eReq => {
                var flag = null;
                for (var key in clients) {
                    io.to(key).emit('response', eReq);
                    // var response = null
                    // while (response != null) {
                    //     socket.on('response', function (data) {
                    //         flag = data;
                    //     })
                    // }
                    // if (flag) {
                    //     break;
                    // }
                }
            })
        });
        // socket.emit('response', data + 'world');
    });

    socket.on('disconnect', () => {
        delete clients[socket.id];
        console.log('driver disconnected');
    });
});

var PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`API running on PORT ${PORT}`);
}); 