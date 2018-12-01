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
var io = socketIO(server, { path: '/app4' });
const max_time = 5;

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

var refuseReq = {};
var allClients = {};
var requestCountFindingTime = {};

var driverSocket = socket => {
    repo.getAllIdentifiedRequest().then(values => {
        if (values.length > 0) {
            var req = values[0];
            console.log("Time: " + requestCountFindingTime[req.Id]);
            if (requestCountFindingTime[req.Id] === undefined) {
                requestCountFindingTime[req.Id] = 1;
            } else {
                var temp = parseInt(requestCountFindingTime[req.Id]);
                temp++;
                requestCountFindingTime[req.Id] = temp;
            }
            if (requestCountFindingTime[req.Id] <= max_time) {
                if (Object.keys(allClients).length > 0) {
                    if (refuseReq[req.Id] === undefined) {
                        refuseReq[req.Id] = [];
                    }
                    const coordReq = {
                        lat: parseFloat(JSON.parse(req.CurCoordinates).lat),
                        lng: parseFloat(JSON.parse(req.CurCoordinates).lng)
                    };
                    repo.getAllReady().then(drivers => {
                        var idDriver = 0;
                        if (drivers.length > 0) {
                            var id = -1;
                            //Tìm driver không bị ignore
                            for (let i = 0; i < drivers.length; i++) {
                                //Danh sách ignore rỗng, lấy driver đầu tiên
                                if (refuseReq[req.Id].length == 0) {
                                    id = 0;
                                    break;
                                }
                                //Vị trí của driver không có trong danh sách ignore
                                if (refuseReq[req.Id].indexOf(drivers[i].Id) == -1) {
                                    id = i;
                                    break;
                                }
                            }
                            if (id > -1) {
                                idDriver = drivers[id].Id;
                                var coordDriver = {
                                    lat: parseFloat(JSON.parse(drivers[id].Coordinates).lat),
                                    lng: parseFloat(JSON.parse(drivers[id].Coordinates).lng)
                                };
                                var minDistance = calcDistance(coordReq, coordDriver);
                                drivers.forEach(d => {
                                    if (refuseReq[req.Id].indexOf(d.Id) == -1) {
                                        coordDriver = {
                                            lat: parseFloat(JSON.parse(d.Coordinates).lat),
                                            lng: parseFloat(JSON.parse(d.Coordinates).lng)
                                        };
                                        var distance = calcDistance(coordReq, coordDriver);
                                        if (distance < minDistance) {
                                            minDistance = distance;
                                            idDriver = d.Id;
                                        }
                                    }
                                });
                                console.log("Refuse request: " + req.Id + ", driver: " + refuseReq[req.Id]);
                                if (refuseReq[req.Id].indexOf(idDriver) == -1 && Object.values(allClients).indexOf(idDriver) >= 0) {
                                    try {
                                        console.log("Send to driver: " + idDriver);
                                        socket.emit("driver" + idDriver, req, function (response) {
                                            console.log(response);
                                        });
                                        refuseReq[req.Id].push(idDriver);
                                    }
                                    catch (err) {
                                        console.log(err);
                                    }
                                } else {
                                    if (refuseReq[req.Id].indexOf(idDriver) == -1) {
                                        refuseReq[req.Id].push(idDriver);
                                    }
                                }
                            }
                        }
                    });
                }
            } else {
                req.Status = "Không có xe";
                repo.updateReqStatus(req);
            }
        }
    });
};

io.on('connection', socket => {
    console.log('a driver connected');

    setInterval(() => {
        driverSocket(socket);
    }, 10000);

    socket.on('join', (userId) => {
        allClients[socket.id] = userId;
        console.log(allClients);
    });

    socket.on('disconnect', () => {
        delete allClients[socket.id];
        console.log('driver disconnected');
    });

    socket.on('reconnect', function () { }); // connection restored  
    socket.on('reconnecting', function (nextRetry) { }); //trying to reconnect
    socket.on('reconnect_failed', function () { console.log("Reconnect failed"); });
});

var PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`API running on PORT ${PORT}`);
});

function calcDistance(coord1, coord2) {
    var R = 6371; // km
    var dLat = toRad(coord2.lat - coord1.lat);
    var dLon = toRad(coord2.lng - coord1.lng);
    var l1 = toRad(coord1.lat);
    var l2 = toRad(coord2.lat);

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(l1) * Math.cos(l2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
}

function toRad(value) {
    return value * Math.PI / 180;
}