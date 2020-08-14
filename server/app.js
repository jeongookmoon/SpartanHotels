var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require('./api.js')
const session = require('express-session')
const MySQLStore = require('express-mysql-session')(session)
const config = require('./sql/config.js')
const passport = require('./auth.js')
const cors = require('cors')
var app = express();

const sessionStore = new MySQLStore(config)

app.use(session({
  secret: 'keybfsdoardafsa cat',
  store: sessionStore,
  resave: false, // will not resave to the session store unless the session is modified.
  saveUninitialized: false, // the session won’t be saved unless we modify it. also won’t send the id back to the browser.
  cookie: { secure: false }
   // if https need set true
 }))

 app.use(passport.initialize())
 app.use(passport.session()) // calls serializeUser and deserializeUser
 
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    "https://spartanhotels.herokuapp.com"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// CORS HANDLING
// app.use(cors({ credentials: true , origin: "http://localhost:3000"}))
// app.use(cors({ credentials: true , origin: "https://spartanhotels.herokuapp.com"}))

//https://stackoverflow.com/a/34574660
// app.use(function(req, res, next) {
//   res.header('Access-Control-Allow-Credentials', true);
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//   next();
// });

// app.use('/', indexRouter);
app.use(express.static("../client/build"));
app.use('/users', usersRouter);
app.use('/api', apiRouter)

app.get('*', (req, res) => {
  res.sendFile(path.resolve('../client/build/index.html'))
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
