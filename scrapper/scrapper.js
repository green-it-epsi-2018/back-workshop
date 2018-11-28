/*
 *	CONFIG
 */
require('dotenv').config()
const db = require('../database/db.js')
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
const PAGE_URL = process.env.PAGE_URL || ""// to fill in local
if(PAGE_URL === ""){
  throw new Error("Remplir la variable d'environnement PAGE_URL");
}
main();

setInterval(main, 8000);

function main() {
    writeToDb(getUsernameFromCsv().map((user) => {
        return getCalendarForUser(user);
    }));
}

function getUsernameFromCsv() {
    return JSON.parse(fs.readFileSync('./scrapper/username.json'))
}


function getLines(elements, promo, date) {
    let arr = [];
    let line;
    $('.Ligne', elements).each((index, element) => {
        line = $(element).html();
        arr.push({
            startDate: getTimestamp($('.Debut', line).text(), date),
            endDate: getTimestamp($('.Fin', line).text(), date),
            matiere: $('.Matiere', line).text().replace(/[^a-zA-Z0-9 ]/g, ""),
            salle: regexp.exec($('.Salle', line).text())[1],
            prof: $('.Prof', line).text().replace(/[^a-zA-Z0-9 ]/g, ""),
            promo: promo.replace(/[^a-zA-Z0-9 ]/g, "")
        });
    });
    return arr;
}


function getTimestamp(hour, dateString) {
    let hourArray = hour.split(':');
    let date = new Date(dateString);
    date.setHours(hourArray[0])
    date.setMinutes(hourArray[1]);
    return date.getTime();
}

function getCalendarForUser(user) {
    return Promise.all(getUrlsWithUser(user.username).map((result) => {
        return axios.get(result.url).then((response) => {
            return getLines(response.data, user.promo, result.date);
        });
    })).then((res) => {
        return flatArray(res);
    });
}

function getUrlsWithUser(user) {
    let urls = [];
    let urlForUser = PAGE_URL.replace('${username}', user);
    let date = new Date();
    let resultDate;
    let urlToAdd;
    for (let i = 0; i < 5; i++) {
        date.setDate(date.getDate() + 1);
        resultDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
        urlToAdd = urlForUser.replace('${date}', resultDate);
        urls.push({
            url: urlToAdd,
            date: resultDate
        });
    }
    return (urls);
}

function writeToDb(documents) {
    Promise.all(documents).then((docs) => {
        flatArray(docs).forEach((doc) => {

            db.insert(doc.startDate, doc.endDate, doc.matiere, doc.salle, doc.prof, doc.promo);

        });

    });
}


function flatArray(array) {
    return array.reduce((arr, element) => {
        return arr.concat(element);
    }, [])
}