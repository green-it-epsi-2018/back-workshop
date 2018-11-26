/*
*	CONFIG

require('dotenv').config()
const REQUIRED_ENV = ['PAGE_URL', 'COOKIE_ZOPEID', 'COOKIE_AC', 'DURATION_TO_GET_IN_DAYS']
if(REQUIRED_ENV.map((cookieKey) => process.env[cookieKey]).some((cookieValue) => cookieValue === undefined)){
	throw `Erreur, les variables d'environnement suivantes sont nécessaires: ${REQUIRED_ENV.join(' , ')}`
}
*/

var services = require('./webservices/services.js');
//var scrapper = require('./scrapper/scrapper.js');