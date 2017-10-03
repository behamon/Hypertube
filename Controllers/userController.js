const mongoose = require('mongoose');
const fs = require('fs');
const multer = require('multer');
const uuid = require('uuid');
const jimp = require('jimp');
const crypto = require('crypto');
const mail = require('../Handlers/mail');
const path = require('path');

const User = mongoose.model('User');
const Comment = mongoose.model('Comment');

// Validate user data before registration
exports.validateRegister = async (req, res, next) => {
	req.checkBody('lastName', 'errLastName').notEmpty();
	req.checkBody('firstName', 'errFirstName').notEmpty();
	req.sanitizeBody('lastName');
	req.sanitizeBody('firstName');
	req.checkBody('email', 'errMail').isEmail();
	req.checkBody('password', 'errPassword').notEmpty();
	req.checkBody('password-confirm', 'errBlankConfirm').notEmpty();
	req.checkBody('password-confirm', 'errNoMatch').equals(req.body.password);

	const results = await req.getValidationResult();
	if (!results.isEmpty()) {
		return res.json({ errors: results.array() });
	}
	return next();
};

exports.registerUser = (req, res, next) => {
	User.register(new User({
		email: req.body.email,
		username: `${req.body.firstName} ${req.body.lastName[0]}`,
		'auth.type': 'local',
	}), req.body.password, (err) => {
		if (err) {
			return res.send(err);
		}
		return next();
	});
};


// Picture Control & Management
exports.validateUpdate = async (req, res, next) => {
	if (req.body.photo) {
		const regex = /^data:.+\/(.+);base64,(.*)$/;
		const picture = req.body.photo.match(regex);
		if (picture) {
			const name = `${req.user.email}.${picture[1]}`;
			if (picture[1] === 'jpg' || picture[1] === 'png' || picture[1] === 'jpeg') {
				fs.writeFileSync(`Public/uploads/${name}`, picture[2], 'base64');
				req.body.photo = `/uploads/${name}`;
			} else {
				return res.send({ errors: [{ msg: 'errPhoto' }] });
			}
		} else {
			return res.send({ errors: [{ msg: 'errPhoto' }] });
		}
	}

	// Input Validation
	req.checkBody('username', 'errUsername').notEmpty();
	req.sanitizeBody('username');
	req.checkBody('email', 'errMail').isEmail();

	const results = await req.getValidationResult();
	if (!results.isEmpty()) {
		return res.json({ errors: results.array() });
	}
	return next();
};

exports.updateUser = async (req, res) => {
	const user = await User.findOneAndUpdate(
		{ email: req.user.email },
		req.body,
		{ new: true, runValidators: true });
	return res.json(user);
};

exports.forgotPass = async (req, res) => {
	const user = await User.findOne({ email: req.query.email });
	if (!user || user.auth.type !== 'local') {
		return res.send(false);
	}
	user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
	user.resetPasswordExpires = Date.now() + 3600000;
	await user.save();
	const resetURL = `http://${req.headers.host}/resetpass/${user.resetPasswordToken}`;
	await mail.send({
		email: user.email,
		subject: 'Password Reset | HyperTube',
		text: `
Hello !

Please follow this link to reset your password:
${resetURL}
See you soon on HyperTube !`,
	});
	return res.send(true);
};

exports.resetPage = async (req, res) => {
	const isValid = await User.findOne({
		resetPasswordToken: req.params.token,
		resetPasswordExpires: { $gt: Date.now() },
	});
	if (!isValid) {
		return res.render('error', { title: 'Token Error', msg: 'There has been an error, Please try again.' });
	}
	return res.render('reset', { title: 'Change your password' });
};

exports.changePassword = async (req, res) => {
	const user = await User.findOne({
		resetPasswordToken: req.params.token,
		resetPasswordExpires: { $gt: Date.now() },
	});
	if (!user) {
		res.render('error', { title: 'Token Error', msg: 'There has been an error, Please try again.' });
	} else if (req.body.password !== req.body.repassword) {
		res.render('error', { title: 'Match Error', msg: 'Passwords do not Match.' });
	} else if (req.body.password.length < 6) {
		res.render('error', { title: 'Error', msg: 'Password is too short' });
	} else {
		user.setPassword(req.body.password, (err) => {
			if (!err) {
				user.resetPasswordToken = undefined;
				user.resetPasswordExpires = undefined;
				user.save();
			}
		});
		res.redirect('/');
	}
};

exports.getUsersByUsername = async (req, res) => {
	const regex = new RegExp(`${req.query.username}`, 'i');
	const users = await User.find({ username: regex }, { username: 1, photo: 1 });
	if (users) {
		const ret = [];
		users.forEach((user, i) => {
			ret.push(user);
		});
		return res.json(ret);
	}
	return res.send(null);
};

// Gets user data to be displayed on his profile
exports.userPage = async (req, res) => {
	const proms = [];
	proms.push(User.findOne({ _id: req.params.id }, { username: 1, photo: 1 }));
	proms.push(
		Comment.find({ author: req.params.id })
			.sort({ posted: -1 })
			.limit(10)
			.populate('movie', ['title', 'image']));
	const [user, coms] = await Promise.all(proms);
	const ret = {
		id: user._id,
		username: user.username,
		photo: user.photo,
		coms,
	};
	res.json(ret);
};
