
// Wrapper to catch controllers errors (async, await)
exports.catchErrors = (fn) => {
	return function(req, res, next) {
		return fn(req, res, next).catch(next);
	};
};

// Not Found Error
exports.notFound = (req, res, next) => {
	const err = new Error('Not Found');
	err.status = 404;
	next(err);
};

exports.developmentErrors = (err, req, res, next) => {
	const errorDetails = {
		message: err.message,
		status: err.status,
		stackHighlighted: err.stack.replace(/[a-z_-\d]+.js:\d+:\d+/gi, '<mark>$&</mark>'),
	};
	res.status(err.status || 500);
	res.format({
		// Based on the `Accept` http header
		'text/html': () => {
			res.render('error', { title: err.status, msg: err.message });
		}, // Form Submit, Reload the page
		'application/json': () => res.json(errorDetails), // Ajax call, send JSON back
	});
};

exports.productionErrors = (err, req, res, next) => {
	res.status(err.status || 500);
	res.redirect('/');
};
