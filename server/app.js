const express = require('express');
const cookieParser = require('cookie-parser')
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const bcrypt = require('bcryptjs');
// const passportLocal = require('./auth/local');
const db = require('../db/index');
const app = express();
const appAdmin = express();
const appClient = express();
const appVendor = express();
const models = require('../db/models/index');
const passport = require('passport');
require('dotenv').config();
// const authHelpers = require('./auth/auth-helpers');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const passportSocketIo = require('passport.socketio');
const slogger = require('slogged')
const moment = require('moment');
// const sessionManager = require('./managers/sessionManager');
// const authManager = require('./managers/authManager');
// const socketManager = require('./managers/socketManager');
// const productManager = require('./managers/productManager');
// const cartManager = require('./managers/cartManager');
// const paymentManager = require('./managers/paymentManager');
const helpers = require('./helpers');
const stripe = require('stripe')('pk_test_6NW0ufnPuIGneWb88nmNDvqR');
const Sifter = require('sifter');
const get_ip = require('ipware')().get_ip;
const useragent = require('useragent');

// Setup logger
var logDirectory = path.join(__dirname, 'logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
// let stream = rfs('file.log', { size: '10M', interval: '1d', path: logDirectory });

morgan.token('type', function(req, res) { return req.user ? req.user.email : 'anonymous' });
morgan.token('moment', function(req, res) { return moment().format('MM/DD/YYYY h:mm:ss a Z') });
app.use(morgan(':remote-addr - :type :referrer :moment ":method :url HTTP/:http-version" :status :response-time ms'));
// app.use(morgan(':remote-addr - :type :referrer :moment ":method :url HTTP/:http-version" :status :response-time ms', {
// stream: stream
// }));
io.use(slogger());
io.engine.generateId = () => {
  return helpers.generateUid(); // custom id must be unique
}

io.on('connection', (socket) => {
  console.log('connected!');
});


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
//json parser
app.use(bodyParser.json())
// Serve static assets
app.use(express.static(path.resolve(__dirname, '..', 'build')))
  // Serve our api
  .use('/api', require('./api'))

// Always return the main index.html, so react-router render the route in the client
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

module.exports = app;