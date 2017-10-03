const express = require('express');
const authController = require('./Controllers/authController');
const userController = require('./Controllers/userController');
const fetchController = require('./Controllers/fetchController');
const torrentController = require('./Controllers/torrentController');
const movieController = require('./Controllers/movieController');
const streamController = require('./Controllers/streamController');
const commentController = require('./Controllers/commentController');
const viewController = require('./Controllers/viewController');
const { catchErrors } = require('./Handlers/errorHandlers');

const router = express.Router();

// Main Application Page
router.get('/', async (req, res) => {
	let movies = await movieController.getTopMovies(req.user && req.user.id);
	res.render('home', {
		title: 'Home',
		user: (req.user || null),
		movies,
	});
});

router.get('/topmovies', movieController.getTopMovies);

// Local Auth and Registration
router.post('/register/local',
	userController.validateRegister,
	userController.registerUser,
	authController.loginNoRedirect);
router.post('/login/local', authController.loginNoRedirect);

// Google Auth and Registration
router.get('/login/google', authController.loginGoogle);
router.get('/login/google/cb', authController.loginGoogleCb);

// 42 Auth and Registration
router.get('/login/42', authController.login42);
router.get('/login/42/cb', authController.login42Cb);
router.get('/logout', authController.logout);

// Password Reset
router.get('/forgot', userController.forgotPass);
router.get('/resetpass/:token', userController.resetPage);
router.post('/resetpass/:token', userController.changePassword);

router.get('/login/hasAccount', catchErrors(authController.hasAccount));

router.post('/update/user',
	userController.validateUpdate,
	userController.updateUser);

// Browse Users
router.get('/users', authController.isLoggedIn, catchErrors(userController.getUsersByUsername));
router.get('/user/:id', authController.isLoggedIn, userController.userPage);

// Movie Comments
router.post('/comment', authController.isLoggedIn, catchErrors(commentController.writeCom));
router.get('/comments/:id', authController.isLoggedIn, catchErrors(commentController.getComs));

// DEV APIs Fetchers
router.get('/fetch/archive', catchErrors(fetchController.fetchArchive));
router.get('/fetch/yts', catchErrors(fetchController.fetchYts));
router.get('/fetch/subs', catchErrors(fetchController.fetchSubs));

// Movie Search
router.get('/search', authController.isLoggedIn, catchErrors(movieController.searchMovie));

// Torrent routes
router.get('/movie/:id/status', authController.isLoggedIn, torrentController.getTorrentStatus);
router.get('/movie/:id',
 authController.isLoggedIn,
 catchErrors(movieController.downloadMovieIfNotExists),
 catchErrors(movieController.getMovieById));

// View Routes
router.post('/view', authController.isLoggedIn, catchErrors(viewController.addView));

// Video Routes
router.get('/video',
	authController.isLoggedIn,
	catchErrors(streamController.getVideoPath),
	streamController.streamVideo);

// Export Routes
module.exports = router;
