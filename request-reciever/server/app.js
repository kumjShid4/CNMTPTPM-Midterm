var express = require('express'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    cors = require('cors'),
    cookieParser = require('cookie-parser');
var app = express();
var controller = require('./controllers/controller');
var userController = require('./controllers/userController');
var verifyAccessToken = require('./repo/authRepo').verifyAccessToken;

app.use(cookieParser());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.sendFile('index.html', {
      root: __dirname + "./../client"
    });
 });

app.use(express.static(__dirname + "./../client"));
app.use('/data', verifyAccessToken, controller);
app.use('/user', userController);

var PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API running on PORT ${PORT}`);
}); 