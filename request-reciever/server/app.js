var express = require('express'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    cors = require('cors');
var app = express();
var controller = require('./controllers/controller');

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
app.use('/data', controller);

var PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API running on PORT ${PORT}`);
}); 