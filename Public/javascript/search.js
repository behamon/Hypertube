function createFilmElem(indx, id, src, title, year, rating, length, current) {
	return (`<div class="col-md-2 col-xl-1 col-4 movieLaunch imgListFilms" filmid="${id}" id="img${indx}" filmCurrent="${current}" filmLength="${length}"><a href="#" style="color: white"><img style="width: 100%;" src="${src}" alt="Image not found.." title="${title}" /><div class="filmMiniature"><p class="text-center filmTitle"><b>${title}</b></p><p class="text-center filmYear">${year}</p><p class="text-center filmRate">${rating} / 10</p></div></a><div style="background-color: rgba(0, 0, 0, 0.66); height: 4px;"><div class="filmReaded" style="background-color: green; height: 100%; width: ${((current) / (length * 60)) * 100}%;")></div></div>`);
}

const getCommentOfFilm = ((id) => {
	$.get(`/comments/${id}`, null, (data) => {
		$('.badge-default').html(data.length);
		data.forEach((comment) => {
			let photo;
			if (comment.author.photo) {
				photo = comment.author.photo;
			} else {
				photo = 'assets/empty_user.png';
			}
			$('#comment').val('');
			$('#commentZone').last().prepend(`<div class="oneOfTheComment" style="padding-bottom: 15px;"><div class="row" style="background-color: #171717;"><div class="col-xs-3"><img src="${photo}" style="width: 100%; height: 100%;" /></div><div class="col-xs-9"><p style="color: #919191;">${comment.author.username}<span style="font-size: 12px;"> - ${getFormattedDate(new Date(comment.posted))}</span></p><p style="color: white; font-size: 10px;">${comment.com}</p></div></div></div>`);
		});
		$('#commentZone').prepend($('#commentaryEntered'));
	});
});

$(document).on('click', '.userOfList', (e) => {
	const uid = e.currentTarget.id;
	let comments = '';
	$.get(`/user/${uid}`, null, (data) => {
		$('#userUsername').html(data.username);
		$('#userPicture').prop('src', data.photo);
		data.coms.forEach((com, i) => {
			comments = `${comments}<div class="row" style="background-color: #171717; margin-bottom: 5px;"><div class="col-3"><img style="width: 100%;" src="${com.movie.image}" /></div><div class="col-9"><p style="color: #919191;">${com.movie.title}<br /><span style="font-size: 13px;">${getFormattedDate(new Date(com.posted))}</span></p><p style="color: white; font-size: 10px;">${com.com}</p></div></div></div>`;
		});
		$('#userComments').html(comments);
	});
	$('#myAccount').fadeOut(0);
	$('#videoList').fadeOut(0);
	$('#filmsList').fadeOut(0);
	$('#search').fadeOut(0);
	$('#videos').fadeOut(0);
	$('#userInformations').fadeIn(100);
});

function getMovieInfos(id) {
	let turn = 0;
	function getFilm() {
		$.get(`/movie/${id}/status`, null, (data) => {
			if (data === true) {
				$('#downloadInfo').fadeOut();
				$('.vjs-captions-button').remove();
				if (defaultLanguage === 'fr') {
					$('.vjs-control-bar').append(`<div class="vjs-captions-button vjs-menu-button vjs-menu-button-popup vjs-control vjs-button" tabindex="0" role="menuitem" aria-live="polite" title="Captions" aria-disabled="false" aria-expanded="false" aria-haspopup="true" aria-label="Captions Menu"><div class="vjs-menu" role="presentation"><ul class="vjs-menu-content" role="menu">
					<li id="offCap" class="vjs-menu-item vjs-selected" tabindex="-1" role="menuitemcheckbox" aria-live="polite" aria-disabled="false" aria-checked="true">captions off<span class="vjs-control-text">, selected</span></li>
					<li id="frenchCap" class="vjs-menu-item" tabindex="-1" role="menuitemcheckbox" aria-live="polite" aria-disabled="false" aria-checked="true" aria-checked="false">Français<span class="vjs-control-text"> </span></li>
					<li id="englishCap" class="vjs-menu-item" tabindex="-1" role="menuitemcheckbox" aria-live="polite" aria-disabled="false" aria-checked="false">English<span class="vjs-control-text"> </span></li>
					</ul></div><span class="vjs-control-text">Captions</span></div>`);
					$('video').append(`<track kind="captions" src="/downloads/${slug}_fr.vtt" srclang="fr" label="Français" default></track>`);
				} else {
					$('.vjs-control-bar').append(`<div class="vjs-captions-button vjs-menu-button vjs-menu-button-popup vjs-control vjs-button" tabindex="0" role="menuitem" aria-live="polite" title="Captions" aria-disabled="false" aria-expanded="false" aria-haspopup="true" aria-label="Captions Menu"><div class="vjs-menu" role="presentation"><ul class="vjs-menu-content" role="menu">
					<li id="offCap" class="vjs-menu-item vjs-selected" tabindex="-1" role="menuitemcheckbox" aria-live="polite" aria-disabled="false" >captions off<span class="vjs-control-text">, selected</span></li>
					<li id="frenchCap" class="vjs-menu-item" tabindex="-1" role="menuitemcheckbox" aria-live="polite" aria-disabled="false" aria-checked="false">Français<span class="vjs-control-text"> </span></li>
					<li id="englishCap" class="vjs-menu-item" tabindex="-1" role="menuitemcheckbox" aria-live="polite" aria-disabled="false" aria-checked="true" aria-checked="false">English<span class="vjs-control-text"> </span></li>
					</ul></div><span class="vjs-control-text">Captions</span></div>`);
					$('video').append(`<track kind="captions" src="/downloads/${slug}_en.vtt" srclang="en" label="English" default></track>`);
				}
				if (turn > 0) {
					$('video')[0].load();
					$('video')[0].play();
					$('#reloadVideoInfo').fadeIn();
				}
			} else {
				turn++;
				$('#downloadInfo').fadeIn();
				getFilm(id);
			}
		});
	}
	getFilm();
}

$(document).ready(() => {
	$('#searchLoading').hide();
	let isReaded = false;
	$('#returnBtn').click(() => {
		$('video')[0].remainingTime = 0;
		$('downloadInfo').fadeOut();
		$('reloadVideoInfo').fadeOut();
		isReaded = false;
		isFilmLoading = false;
		state = 0;
	});

	function showList() {
		$('#search').fadeIn(50);
		if (search === 0) {
			$('#videoList').fadeIn(50);
		} else {
			$('#filmsList').fadeIn(50);
		}
	}

	$('.vjs-control-bar').on('click', '#offCap', () => {
		$('track').remove();
		$('#offCap').addClass('vjs-selected');
		$('#frenchCap').removeClass('vjs-selected');
		$('#englishCap').removeClass('vjs-selected');
	});

	$('.vjs-control-bar').on('click', '#frenchCap', () => {
		$('track').remove();
		$('#offCap').removeClass('vjs-selected');
		$('#frenchCap').addClass('vjs-selected');
		$('#englishCap').removeClass('vjs-selected');
		$('video').append(`<track kind="captions" src="/downloads/${slug}_fr.vtt" srclang="fr" label="Français" default></track>`);
	});

	$('.vjs-control-bar').on('click', '#englishCap', () => {
		$('track').remove();
		$('#offCap').removeClass('vjs-selected');
		$('#frenchCap').removeClass('vjs-selected');
		$('#englishCap').addClass('vjs-selected');
		$('video').append(`<track kind="captions" src="/downloads/${slug}_en.vtt" srclang="en" label="English" default></track>`);
	});

	$('#video').on('click', 'video, .vjs-big-play-button', () => {
		if (isFilmLoading === false) {
			isFilmLoading = true;
			getMovieInfos($('#video').attr('fid'));
		}
	});

	const slider = $('#rating');

	slider.on('mouseenter', slider, (e) => {
		$('.noUi-tooltip').show();
	});

	slider.on('mouseleave', slider, (e) => {
		$('.noUi-tooltip').hide();
	});

	noUiSlider.create(slider[0], {
		start: 3.3,
		step: 0.1,
		tooltips: [wNumb({ decimals: 1 })],
		range: {
			min: 0,
			max: 10,
		},
	});
	$('.noUi-tooltip').hide();

	function showVideo() {
		isReaded = true;
		$('#videos').fadeIn(50);
	}
	$('#closeUserInfo').click(() => {
		if (state === 0) {
			$('#userInformations').fadeOut(50, showList);
		} else {
			$('#userInformations').fadeOut(50, showVideo);
		}
	});
	let index = 0;
	let filmListNumber = 0;
	function showFilms(films, i) {
		const w = i - 1;
		const x = (23 * filmListNumber) - index;
		if (i > 0) {
			if ((index % 6) === 0) {
				if (index === 0) {
					$('#filmsList').append(`<div style="margin-top: 15px;" class="row"><div class="col-xl-3 col-lg-down-0"></div>`);
				} else {
					$('#filmsList').append(`</div><div style="margin-top: 15px;" class="row"><div class="col-xl-3 col-lg-down-0"></div>`);
				}
			}
			$('#filmsList > .row').last().append(createFilmElem(index + (24 * filmListNumber), films[index]._id, films[index].image, films[index].title, films[index].year, films[index].rating, films[index].length, films[index].current));
			index += 1;
		} else {
			$('#searchBtn').prop('disabled', false);
			$('#filmsList').append('</div>');
			index = 0;
			return false;
		}
		return showFilms(films, w);
	}
	$('#vListDiv').on('mouseenter', '.movieLaunch', (e) => {
		const id = e.currentTarget.id;
		$(`#${id} > a > div`).css('width', $(`#${id} > a > img`).prop('width'));
		$(`#${id} > a > div`).animate({
			height: '70%',
			top: '30%',
		}, 100, () => {});
	});

	$('#vListDiv').on('mouseleave', '.movieLaunch', (e) => {
		const id = e.currentTarget.id;
		$(`#${id} > a > div`).animate({
			height: '0%',
			top: '100%',
		}, 100, () => {});
	});

	let isLoading = false;
	$(window).bind('mousewheel', (event) => {
		if (isReaded === false) {
			let uselessVar = null;
			if (event.originalEvent.wheelDelta >= 0) {
				uselessVar = true;
			} else if (searchMode === true && isLoading === false) {
				if ($(window).scrollTop() + $(window).height() >= ($(document).height() - 5)) {
					$('#searchLoading').show();
					isLoading = true;
					const string = $('#searchValue').val() || null;
					const genre = $('#categoryValue').val() || null;
					const sort = $('#orderByValue').val() || null;
					const rating = $('#rating').val() || null;
					filmListNumber += 1;
					const options = { string, genre, sort, rating, index: filmListNumber };
					$.get('/search', options, (data) => {
						if (data.length > 0) {
							$('#filmsList').fadeIn(0);
							$('#videoList').hide(250);
							isLoading = showFilms(data, data.length);
						} else {
							isLoading = false;
							$('#searchBtn').prop('disabled', false);
						}
						$('#searchLoading').hide();
					});
				}
			}
		}
	});

	$('#vListDiv').on('click', '.movieLaunch', (e) => {
		const filmid = e.currentTarget.getAttribute('filmid');
		state = 1;
		$.get(`/movie/${filmid}`, null, (data) => {
			$('#videoTitle > span, #videoTitle > br').remove();
			$('#videoTitle').prepend(`<span>${data.title}</span><br />`);
			slug = data.slug;
			$('.infos').html(`${data.title} - ${data.year}<br /><br />${data.rating} / 10<br /><br />${data.description}`);
			$('#video').attr('fid', filmid);
			$('.vjs-poster').remove();
			$('video').html(`<source src="/video?id=${filmid}" type="video/mp4" />`);
			getCommentOfFilm(filmid);
			$('video').append(`<div class="vjs-poster" tabindex="-1" aria-disabled="false" style="background-image: url(${data.image});"></div>`);
			$('video').attr('poster', data.image);
			$('video')[0].currentTime = $(`div[filmid=${data.id}]`).attr('filmCurrent');
			$('#search').fadeOut(50);
			$('#filmsList').fadeOut(50);
			$('#videoList').fadeOut(50, showVideo);
		});
	});

	$('#searchBtn').click(() => {
		filmListNumber = 0;
		$('#searchBtn').prop('disabled', true);
		const string = $('#searchValue').val();
		const genre = $('#categoryValue').val() || null;
		const sort = $('#orderByValue').val() || null;
		const rating = slider[0].noUiSlider.get() || null;
		const options = { string, genre, sort, rating, index: filmListNumber };
		$.get('/search', options, (data) => {
			if (data.length > 0) {
				searchMode = true;
				$('#filmsList .row').remove();
				$('#filmsList').fadeIn(0);
				$('#videoList').hide(250, showFilms(data, data.length));
			} else {
				$('#searchBtn').prop('disabled', false);
			}
		});
	});
	$('#searchValue').keypress((e) => {
		if (e.which === 13 && !$('#searchBtn').prop('disabled')) {
			$('#searchBtn').click();
		}
	});

	const isCharOrDelete = (char) => {
		if (char >= 65 && char <= 90) {
			return (true);
		} else if (char === 8) {
			return (true);
		} else if (char >= 48 && char <= 57) {
			return (true);
		} else if (char === 32) {
			return (true);
		}
		return (false);
	};

	$('.userOfList').click((e) => {
		const userId = e.id;
	});

	$('#searchUserValue').focusout(() => {
		$('.userOfList').fadeOut(150);
	});
	$('#searchUserValue').focusin(() => {
		$('.userOfList').fadeIn(150);
	});

	$('#searchUserValue').keyup((e) => {
		if (isCharOrDelete(e.which)) {
			if ($('#searchUserValue').val().length > 2) {
				$('#searchUserBtn').prop('disabled', true);
				const uName = $('#searchUserValue').val() || null;
				$.get('/users', { username: uName }, (data) => {
					$('.userOfList').remove();
					data.forEach((user, i) => {
						$('#userFoundList').html(`${$('#userFoundList').html()}<a class="userOfList col-12" id="${user._id}" href="#" style="height: 30px; width: 100%; margin-bottom: 2px;text-decoration: none;"><div style="height: 100%; width: 100%; background-color: rgba(0, 0, 0, 1);"><img src="${user.photo}" style="width: 30px; height: 30px; float: left;" /><p style="color: gray; text-align: center;">&nbsp;${user.username}</p></div></a>`);
					});
				});
			} else {
				$('.userOfList').remove();
			}
		}
	});
});
