const passport = require('passport');
const mongoose = require('mongoose');

const User = mongoose.model('User');

// Homemade email login strategy
exports.loginNoRedirect = (req, res, next) => {
	passport.authenticate('local', (err, user, info) => {
		if (!user) { return res.send(false); }
		req.logIn(user, (error) => {
			if (error) { return res.send(error); }
			return true;
		});
		return res.send({
			username: user.username,
			email: user.email,
		});
	})(req, res, next);
};

exports.isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	}
	return res.send('errNotLogged');
};

// Google strategy
exports.loginGoogle = passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.profile.emails.read'] });
exports.loginGoogleCb = passport.authenticate('google', { failureRedirect: '/', successRedirect: '/' });

// 42 Strategy
exports.login42 = passport.authenticate('42');
exports.login42Cb = passport.authenticate('42', { failureRedirect: '/', successRedirect: '/' });

exports.hasAccount = async (req, res) => {
	const user = await User.findOne(req.query);
	res.send((user && user.auth.type) || false);
};

exports.logout = (req, res) => {
	req.logOut();
	req.session.destroy((err) => { res.redirect('/'); });
};
