// Require Modules
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const MongoStore = require('connect-mongo')(session);
const path = require('path');
const expressValidator = require('express-validator');
const bodyParser = require('body-parser');

// Require Needed Files
const helpers = require('./Handlers/helpers');
const routines = require('./Handlers/routines');
const fetchController = require('./Controllers/fetchController');
const errorHandlers = require('./Handlers/errorHandlers');
const routes = require('./index');
require('./handlers/passport');

const app = express();

// Fetching APIs every ~5 hours
setInterval(fetchController.fetchYtsDaily, 18000000);
setInterval(fetchController.fetchArchiveDaily, 18001000);

// Cleaning Unwatched Movies every 24 hours
setInterval(routines.cleanMovies, 86400000);

// View Engine
app.set('views', path.join(__dirname, 'Views'));
app.set('view engine', 'pug');

// Serving '/Public' folder to client
app.use(express.static(path.join(__dirname, 'Public')));

// Makes raw requests readable in req.body
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
app.use(expressValidator());

// Db sessions
app.use(session({
	secret: process.env.SECRET,
	key: process.env.KEY,
	resave: false,
	saveUninitialized: false,
	store: new MongoStore({ mongooseConnection: mongoose.connection }),
}));

// Passport Auth
app.use(passport.initialize());
app.use(passport.session());

// Passing variables to templates + all requests
app.use((req, res, next) => {
	res.locals.h = helpers;
	next();
});

// Routes !
app.use('/', routes);

// If that above routes didnt work, we 404 them and forward to error handler
app.use(errorHandlers.notFound);

// Otherwise this was a real error
app.use(errorHandlers.developmentErrors);


module.exports = app;
