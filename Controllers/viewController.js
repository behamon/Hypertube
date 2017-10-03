const mongoose = require('mongoose');

const View = mongoose.model('View');

// Update if specific movie has been viewed and its current time for user
exports.addView = async (req, res) => {
	const newView = await View.findOneAndUpdate({
		movie: req.body.movieId,
		user: req.user.id,
	}, {
		current: req.body.currentTime,
	},
	{ upsert: true, new: true });
	res.json(newView);
};
