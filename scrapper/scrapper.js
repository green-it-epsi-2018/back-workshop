/*
*	CONFIG
*/
require('dotenv').config()

/*
*	MODULE LOADING
*/
const fs = require('fs')
const axios = require('axios')
const regexp = new RegExp('^N?(\\d+[a-zA-Z]*)');

const $ = require('cheerio')

/*
*	CONSTANTS CONFIGURATION
*/
const PAGE_URL = "http://edtmobilite.wigorservices.net/WebPsDyn.aspx?Action=posETUD&serverid=h&tel=${username}&date=${date}%208:00"
main();

function main(){
    writeToDb(getUsernameFromCsv().map((user) =>{
        return getCalendarForUser(user);
    }));
}

function getUsernameFromCsv(){
    return JSON.parse(fs.readFileSync('username.json'))
}


function getLines(elements,promo){
    let arr = [];
    $('.Ligne',elements).each((index,element)=>{
        let line = $(element).html();
        arr.push({
            startDate:$('.Debut',line).text(),
            endDate:$('.Fin',line).text(),
            matiere:$('.Matiere',line).text(),
            salle:regexp.exec($('.Salle',line).text())[1],
            prof:$('.Prof',line).text(),
            promo:promo
        });
    });
    return arr;
}
function getCalendarForUser(user){
    return Promise.all(getUrlsWithUser(user.username).map((url)=>{
        return axios.get(url).then((response)=>{
           return getLines(response.data,user.promo);
        });
    })).then((res)=>{
        return flatArray(res);
    });
}

function getUrlsWithUser(user){
    let urls = [];
    let urlForUser = PAGE_URL.replace('${username}',user);
    let date = new Date();
    let resultDate;
    let urlToAdd;
    //FIXME add 60 days
    for(let i =0;i<5;i++){
        date.setDate(date.getDate()+1);
        resultDate = (date.getMonth()+1) +'/'+date.getDate() +'/'+  date.getFullYear();
        urlToAdd = urlForUser.replace('${date}',resultDate);
        urls.push(urlToAdd)
    }
    return(urls);
}

function writeToDb(documents){
    Promise.all(documents).then((doc) => {
        console.log(flatArray(doc));
    });
}


function flatArray(array){
    return array.reduce((arr,element)=>{
        return  arr.concat(element);
    },[])
}
