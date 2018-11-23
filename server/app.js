var express = require('express'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    cors = require('cors'),
    cookieParser = require('cookie-parser');
var app = express();
var receiver = require('./controllers/receiverController');
var identifier = require('./controllers/identifierController');
var manager = require('./controllers/managerController');
var driver = require('./controllers/driverController');
var userController = require('./controllers/userController');
var verifyUser = require('./repo/authRepo').verifyAuthenticationUser;
var verifyIdentifier = require('./repo/authRepo').verifyAuthenticationIdentifier;
var verifyDriver = require('./repo/authRepo').verifyAuthenticationDriver;
var verifyManager = require('./repo/authRepo').verifyAuthenticationManager;

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

var PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API running on PORT ${PORT}`);
}); 