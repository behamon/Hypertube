const mongoose = require('mongoose');

const viewSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: true,
	},
	movie: {
		type: mongoose.Schema.ObjectId,
		ref: 'Movie',
		required: true,
	},
	current: {
		type: Number,
	},
});

module.exports = mongoose.model('View', viewSchema);
