var express = require('express'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    cors = require('cors')

var controller = require('./controllers/controller');

var app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cors());

app.use('/requests/management', controller);

var PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`API running on PORT ${PORT}`);
}); 