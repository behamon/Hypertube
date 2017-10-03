const getFormattedDate = (date) => {
	const year = date.getFullYear();

	let month = (1 + date.getMonth()).toString();
	month = month.length > 1 ? month : `0${month}`;

	let day = date.getDate().toString();
	day = day.length > 1 ? day : `0${day}`;

	let hours = date.getHours().toString();
	hours = hours.length > 1 ? hours : `0${hours}`;

	let minutes = date.getMinutes().toString();
	minutes = minutes.length > 1 ? minutes : `0${minutes}`;
	return (`${month}/${day}/${year} ${hours}:${minutes}`);
};

$(document).ready(() => {
	$('#comment').keypress((e) => {
		if (e.which === 13) {
			const com = $('#comment').val();
			$.post('/comment', { movieId: $('#video').attr('fid'), com }, (data) => {
				let photo;
				if (data.user.photo) {
					photo = data.user.photo;
				} else {
					photo = 'assets/empty_user.png';
				}
				if (data.param === 'success') {
					$('#comment').val('');
					$('#commentZone').last().prepend(`<div class="oneOfTheComment" style="padding-bottom: 15px;"><div class="row" style="background-color: #171717;"><div class="col-xs-3"><img src="${photo}" style="width: 100%; height: 100%;" /></div><div class="col-xs-9"><p style="color: #919191;">${data.user.username}<span style="font-size: 12px;"> - ${getFormattedDate(new Date(data.com.posted))}</span></p><p style="color: white; font-size: 10px;">${data.com.com}</p></div></div></div>`);
					$('#commentZone').prepend($('#commentaryEntered'));
					$('#comment').focus();
				} else {
					throwError(data.errors.msg, 5);
				}
			});
		}
	});
});
