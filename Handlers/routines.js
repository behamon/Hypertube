const mongoose = require('mongoose');
const torrentController = require('../Controllers/torrentController');

const Movie = mongoose.model('Movie');

// Clean movies if they have not been seen in a month
exports.cleanMovies = async () => {
	const movies = await Movie.find({ 'file.expires': { $gt: new Date(Date.now() + 2592000000) } });
	if (movies) {
		movies.forEach((movie, i) => {
			torrentController.deleteTorrent(movie.hash);
		});
		Movie.update(
			{ 'file.expires': { $gt: new Date(Date.now() + 2592000000) } },
			{ file: undefined }).exec();
	}
};
