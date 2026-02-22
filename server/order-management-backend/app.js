var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors'); // Add CORS

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var orderRoutes = require('./routes/orderRoutes');     // Import Order Routes
var requestRoutes = require('./routes/requestRoutes'); // Import Request Routes
var templateRoutes = require('./routes/templateRoutes'); // Import Template Routes

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors()); // Enable CORS for everything
app.use(logger('dev'));
app.use(express.json({ limit: '500mb' })); // Increase limit for Base64 images
app.use(express.urlencoded({ extended: false, limit: '500mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// Ensure previews are accessible
app.use('/previews', express.static(path.join(__dirname, 'public/previews')));
// Ensure uploads are accessible with CORS headers
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads'), {
  setHeaders: function (res, path, stat) {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
  }
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/orders', orderRoutes);       // Mount Order Routes
app.use('/api/requests', requestRoutes);   // Mount Request Routes
app.use('/api/templates', templateRoutes); // Mount Template Routes

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
