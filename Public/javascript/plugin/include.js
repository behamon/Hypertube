const include = (url, callback) => {
    /* on crée une balise<script type="text/javascript"></script> */
	const script = document.createElement('script');
	script.type = 'application/javascript';

    /* On fait pointer la balise sur le script qu'on veut charger
       avec en prime un timestamp pour éviter les problèmes de cache
    */

	script.src = url;

    /* On dit d'exécuter cette fonction une fois que le script est chargé */
	if (callback) {
		script.onreadystatechange = callback;
		script.onload = script.onreadystatechange;
	}

    /* On rajoute la balise script dans le head, ce qui démarre le téléchargement */
	document.getElementsByTagName('head')[0].appendChild(script);
};
