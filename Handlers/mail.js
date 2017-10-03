const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	secure: true,
	port: 465,
	auth: {
		user: process.env.MAIL_ADDR,
		pass: process.env.MAIL_PASS,
	},
});

const sendMail = mailOptions => new Promise((resolve, reject) => {
	transport.sendMail(mailOptions, (error, info) => {
		if (!error) {
			resolve(info);
		} else {
			reject(error);
		}
	});
});

exports.send = async (options) => {
	const mailOptions = {
		from: 'HyperTube Support <support@hypertube.com>',
		to: options.email,
		subject: options.subject,
		text: options.text,
	};
	return sendMail(mailOptions);
};
