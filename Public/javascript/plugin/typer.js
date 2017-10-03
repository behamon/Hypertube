function changeText(cont1, cont2, speed) {
	const Otext = cont1.text();
	const Ocontent = Otext.split('');
	let i = 0;
	cont2.html(Ocontent[i]);
	function show() {
		if (i < Ocontent.length) {
			i += 1;
			cont2.append(Ocontent[i]);
		}
	}
	const Otimer = setInterval(show, speed);
}
