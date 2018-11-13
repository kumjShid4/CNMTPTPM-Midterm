var express = require('express'),
    bodyParser = require('body-parser'),
    morgan = require('morgan');
 
var app = express();
 
app.use(morgan('dev'));
app.use(bodyParser.json());
 
app.get('/', (req, res) => {
    res.sendFile('index.html', {
      root: __dirname + "./../client"
    });
 });
 
app.use(express.static(__dirname + "./../client"));
 
var PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`API running on PORT ${PORT}`);
});