var express = require('express'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    cors = require('cors'),
    path = require('path');
var app = express();
var controller = require('./controllers/controller');

app.use(morgan('dev'));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile('index.html', {
      root: __dirname + "./../client"
    });
 });

app.use(express.static(__dirname + "./../client"));
app.use('/data', controller);
app.use(cors());

var PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`API running on PORT ${PORT}`);
}); 