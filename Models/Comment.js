const mongoose = require('mongoose');

const comSchema = new mongoose.Schema({
	com: {
		type: String,
		required: true,
	},
	author: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: true,
	},
	movie: {
		type: mongoose.Schema.ObjectId,
		ref: 'Movie',
		required: true,
	},
	posted: {
		type: Date,
		default: Date.now,
	},
});

comSchema.pre('save', function populateAuthor(next) {
	this.populate('author');
	next();
});

module.exports = mongoose.model('Comment', comSchema);
