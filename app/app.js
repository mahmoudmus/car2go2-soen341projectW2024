var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
var logger = require('morgan');
const expressLayouts = require('express-ejs-layouts');

// setting environment variables
require('dotenv').config();

const { authenticate } = require('./controllers/authController');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/user');
const vehiclesRouter = require('./routes/vehicle');
const reservationsRouter = require('./routes/reservation');
const branchesRouter = require('./routes/branch');

var app = express();

// mongoose connection setup
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const mongoDB = process.env.MONGODB_URI;

main().catch((err) => console.log(err));
async function main() {
    await mongoose.connect(mongoDB);
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(authenticate);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules/bootstrap/dist/')));
app.use(express.static(path.join(__dirname, 'node_modules/bootstrap-icons/')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/vehicles', vehiclesRouter);
app.use('/reservations', reservationsRouter);
app.use('/branches', branchesRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
