/**
 * Load enviroment form a .env file
 */

require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var flash = require('connect-flash');
const mongoose = require('mongoose');

/**
 * Connect mongoose
 */

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'minichat',
})

// router web and api
var webRouter = require('../routes/web');
var apiRouter = require('../routes/api');

var app = express();

// view engine setup
app.set('views', path.join(path.dirname(__dirname), 'views/pages'));
app.set('view engine', 'ejs');

// global middleware
app.use(logger('dev'));
app.use(express.json());
app.use(require('connect-multiparty')());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(path.dirname(__dirname), 'public')));

/**
 * Use redis session
 */
app.use(session({
  store: require('./redis').store,
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    secure: false,
  }
}));
app.use(flash());

/**
 * Register router web and api
 */

app.use('/', webRouter);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.status(404).render('errors/404');
});

// error handler
app.use(function (err, req, res, next) {
  var env= process.env.ENV.toLowerCase();
  if (env === 'local') {
    res.locals.message = err.message;
    res.locals.error = err;
    res.status(err.status || 500);
    res.render('error');
  } else {
    res.status(500).render('errors/500');
  }
  
});

module.exports = app;
