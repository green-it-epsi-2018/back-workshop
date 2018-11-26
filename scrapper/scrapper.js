/*
*	CONFIG
*/
require('dotenv').config()
//const REQUIRED_ENV = ['PAGE_URL', 'COOKIE_ZOPEID', 'COOKIE_AC', 'DURATION_TO_GET_IN_DAYS']
/*if(REQUIRED_ENV.map((cookieKey) => process.env[cookieKey]).some((cookieValue) => cookieValue === undefined)){
    throw `Erreur, les variables d'environnement suivantes sont nécessaires: ${REQUIRED_ENV.join(' , ')}`
}*/

/*
*	MODULE LOADING
*/
const fs = require('fs')
const axios = require('axios')
const axiosRetry = require('axios-retry')

const HTTP_ERROR_CODES = [403, 404, 401]

axiosRetry(axios, { retries: process.env['HTTP_RETRY_COUNT'] || 3, retryCondition: (data) => {
        if(!data.response){
            //console.error(data)
            return true
        }
        return HTTP_ERROR_CODES.includes(data.response.status) || (""+data.response.status).startsWith(5)
    }});
const cheerio = require('cheerio')

/*
 *	CONSTANTS CONFIGURATION
 */
const PAGE_URL = process.env.PAGE_URL || ""// to fill in local
if(PAGE_URL === ""){
  throw new Error("Remplir la variable d'environnement PAGE_URL");
}
main();

function main(){
    getUsernameFromCsv().forEach((user) =>{
        writeToDb(getCalendarForUser(user));
    });
}

function getUsernameFromCsv(){
    return JSON.parse(fs.readFileSync('username.json'))
}

function getCalendarForUser(user){
    let url = getUrlWithUser(user);
    /*axios.get(PAGE_URL).then((response)=>{
    	console.log(response);
	});*/
}

function getUrlWithUser(user){
    let urlsForUser = PAGE_URL.replace('${username}',user);
    let date = new Date();
    let today = date.getDate() +'/'+ (date.getMonth()+1) +'/'+ date.getFullYear();
    date.setDate(date.getDate()+60);
    let endDate =  date.getDate() +'/'+ (date.getMonth()+1) +'/'+ date.getFullYear()
    urlForUser = urlsForUser.replace('${date}',today);
    console.log(urlForUser);
}

function writeToDb(){
    return null;
}
