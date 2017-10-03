$(document).ready(() => {
	const langs = ['en', 'fr'];
	let langCode = navigator.languages[0];

	const translate = (jsdata) => {
		$('[tkey]').each(function replaceStrings(index) {
			const strTr = jsdata[$(this).attr('tkey')];
			$(this).html(strTr + $(this).html());
		});
	};


	langCode = navigator.languages[0];
	if (langs.indexOf(langCode) !== -1) {
		$.getJSON(`/locals/${langCode}.json`, translate);
	} else if (langs.indexOf(`${langCode[0]}${langCode[1]}`) !== -1) {
		$.getJSON(`/locals/${langCode[0]}${langCode[1]}.json`, translate);
	} else {
		$.getJSON('/locals/en.json', translate);
	}
});
