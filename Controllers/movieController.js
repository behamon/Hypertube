const mongoose = require('mongoose');
const fs = require('fs');
const fetchController = require('./fetchController');
const torrentController = require('./torrentController');

const Movie = mongoose.model('Movie');
const Comment = mongoose.model('Comment');
const View = mongoose.model('View');

// Get movie from DB and format it
exports.getMovieById = async (req, res) => {
	const proms = [];
	proms.push(Movie.findOne({ _id: req.params.id }));
	proms.push(
		Comment.find({ movie: req.params.id })
			.sort({ posted: -1 })
			.populate('author', ['username', 'photo']));
	const [movie, coms] = await Promise.all(proms);
	if (!movie) {
		return res.send('This movie doesn\'t exist');
	}
	const ret = {
		id: movie._id,
		title: movie.title,
		slug: movie.slug,
		description: movie.description,
		year: movie.year,
		rating: movie.rating,
		length: movie.length,
		image: movie.image,
		coms,
	};
	req.movie = movie;
	return res.json(ret);
};

// Movie search function
exports.searchMovie = async (req, res) => {
	if (req.query.string !== '' && !req.query.string.match(/^[a-z 0-9]+$/i)) {
		return res.send(null);
	}
	const agg = [];
	const regex = new RegExp(`${req.query.string}`);
	agg.push({ $match: { $or: [
		{ title: { $regex: regex, $options: 'i' } },
		{ genres: { $regex: regex, $options: 'i' } },
	] } });
	if (req.query.genre && req.query.genre.length) {
		agg.push({ $match: { genres: req.query.genre } });
	}
	if (req.query.rating) {
		agg.push({ $match: { rating: { $gte: Number(req.query.rating) } } });
	}
	if (req.query.sort && req.query.sort.length) {
		const sort = {};
		if (req.query.sort === 'title' || req.query.sort === 'length') {
			sort[req.query.sort] = 1;
		} else if (req.query.sort === 'year' || req.query.sort === 'rating') {
			sort[req.query.sort] = -1;
		}
		agg.push({ $sort: sort });
	} else {
		agg.push({ $sort: { rating: -1 } });
	}
	agg.push({ $skip: 24 * Number(req.query.index) });
	agg.push({ $limit: 24 });
	agg.push({ $project: {
		_id: 1,
		slug: 1,
		title: 1,
		image: 1,
		genres: 1,
		rating: 1,
		year: 1,
		length: 1,
	} });
	const movies = await Movie.aggregate(agg);
	const proms = [];
	movies.forEach((movie) => {
		proms.push(View.findOne({ movie: movie._id, user: req.user.id }));
	});
	const views = await Promise.all(proms);
	movies.map((movie, i) => { movie.current = (views[i] && views[i].current) || 0; });
	return res.json(movies);
};

// Launches movie download if necessary
exports.downloadMovieIfNotExists = async (req, res, next) => {
	const movie = await Movie.findOne({ _id: req.params.id });
	if (!movie.file || !movie.file.path) {
		torrentController.addTorrentUrlToQueue(movie.magnet);
		fetchController.fetchSubs(movie);
	}
	return next();
};

// Gets - from DB - 6 top rated movies from 4 fixed categories
exports.getTopMovies = async (userId) => {
	if (!userId) {
		return null;
	}
	const movies = [];
	const proms = [];
	const SciFi = await Movie.aggregate([
		{ $match: { genres: 'Sci-Fi' } },
		{ $sort: { rating: -1 } },
		{ $limit: 6 },
		{ $project: { _id: 1, slug: 1, rating: 1, year: 1, title: 1, image: 1, length: 1 } },
	]);

	const Action = await Movie.aggregate([
		{ $match: { genres: 'Action' } },
		{ $match: { slug: { $nin: SciFi.map(movie => movie.slug) } } },
		{ $sort: { rating: -1 } },
		{ $limit: 6 },
		{ $project: { _id: 1, slug: 1, rating: 1, year: 1, title: 1, image: 1, length: 1 } },
	]);

	const Comedy = await Movie.aggregate([
		{ $match: { genres: 'Comedy' } },
		{ $match: { slug: { $nin: SciFi.map(movie => movie.slug) } } },
		{ $match: { slug: { $nin: Action.map(movie => movie.slug) } } },
		{ $sort: { rating: -1 } },
		{ $limit: 6 },
		{ $project: { _id: 1, slug: 1, rating: 1, year: 1, title: 1, image: 1, length: 1 } },
	]);
	const Drama = await Movie.aggregate([
		{ $match: { genres: 'Drama' } },
		{ $match: { slug: { $nin: SciFi.map(movie => movie.slug) } } },
		{ $match: { slug: { $nin: Action.map(movie => movie.slug) } } },
		{ $match: { slug: { $nin: Comedy.map(movie => movie.slug) } } },
		{ $sort: { rating: -1 } },
		{ $limit: 6 },
		{ $project: { _id: 1, slug: 1, rating: 1, year: 1, title: 1, image: 1, length: 1 } },
	]);
	movies.push(SciFi, Action, Comedy, Drama);
	movies.forEach((cat) => {
		cat.forEach((movie) => {
			proms.push(View.findOne({ movie: movie._id, user: userId }));
		});
	});
	const views = await Promise.all(proms);
	let n = 0;
	movies.forEach((cat) => {
		cat.map((movie, i) => { movie.current = (views[i + n] && views[i + n].current) || 0; });
		n += 6;
	});
	return movies;
};
