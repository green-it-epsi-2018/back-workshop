/*
*	CONFIG
*/
require('dotenv').config()

/*
*	MODULE LOADING
*/
const fs = require('fs')
const axios = require('axios')
const axiosRetry = require('axios-retry')

const regexp = new RegExp('^N?(\\d+[a-zA-Z]*)');

const HTTP_ERROR_CODES = [403, 404, 401]

axiosRetry(axios, { retries: process.env['HTTP_RETRY_COUNT'] || 3, retryCondition: (data) => {
        if(!data.response){
            //console.error(data)
            return true
        }
        return HTTP_ERROR_CODES.includes(data.response.status) || (""+data.response.status).startsWith(5)
    }});
const $ = require('cheerio')

/*
 *	CONSTANTS CONFIGURATION
 */
const PAGE_URL = process.env.PAGE_URL || ""// to fill in local
if(PAGE_URL === ""){
  throw new Error("Remplir la variable d'environnement PAGE_URL");
}
main();

function main(){
    writeToDb(getUsernameFromCsv().map((user) =>{
        return getCalendarForUser(user);
    }));
}

function getUsernameFromCsv(){
    return JSON.parse(fs.readFileSync('username.json'))
}

function getCalendarForUser(user){
    return Promise.all(getUrlsWithUser(user).map((url)=>{
        return axios.get(url).then((response)=>{
            let arr = [];
            $('.Ligne',response.data).each((index,element)=>{
                let line = $(element).html();
                arr.push({
                    startDate:$('.Debut',line).text(),
                    endDate:$('.Fin',line).text(),
                    matiere:$('.Matiere',line).text(),
                    salle:regexp.exec($('.Salle',line).text())[1],
                    prof:$('.Prof',line).text()
                });
            });
            return arr;
        });
    })).then((res)=>{
        return res;
    })
}

function getUrlsWithUser(user){
    let urls = [];
    let urlForUser = PAGE_URL.replace('${username}',user);
    let date = new Date();
    let resultDate;
    let urlToAdd;
    //FIXME add 60 days
    for(let i =0;i<1;i++){
        date.setDate(date.getDate()+1);
        resultDate = (date.getMonth()+1) +'/'+date.getDate() +'/'+  date.getFullYear();
        urlToAdd = urlForUser.replace('${date}',resultDate);
        urls.push(urlToAdd)
    }
    return(urls);
}

function writeToDb(documents){
}
