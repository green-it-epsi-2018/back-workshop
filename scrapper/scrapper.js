/*
 *	CONFIG
 */
require('dotenv').config()

const EventsDatabase = require('../database/events_db');
/*
 *	MODULE LOADING
 */
const fs = require('fs')
const axios = require('axios')
const regexp = new RegExp('^N?(\\d+[a-zA-Z]*)');

const $ = require('cheerio')
const HOURS_SCRAP = 4;
const MAX_DAYS = 5;

/*
 *	CONSTANTS CONFIGURATION
 */
const PAGE_URL = process.env.PAGE_URL || "" // to fill in local
if (PAGE_URL === "") {
    throw new Error("Remplir la variable d'environnement PAGE_URL");
}

module.exports = db => {
    db = new EventsDatabase(db);
    main(db);
    setInterval(main, HOURS_SCRAP * 3600 * 1000);
}

function main(db) {
    console.log("Began scrapping");
    db.deleteAll()
    writeToDb(db, getUsernameFromCsv().map((user) => {
        return getCalendarForUser(user);
    }));
}

function getUsernameFromCsv() {
    const users = JSON.parse(fs.readFileSync('./scrapper/username.json'))
    console.log(`${users.length} users fetched from csv`)
    return users
}


function getLines(elements, promo, date) {
    let arr = [];
    let line;
    $('.Ligne', elements).each((index, element) => {
        line = $(element).html();
        let salle = regexp.exec($('.Salle', line).text())[1];
        arr.push({
            startDate: getTimestamp($('.Debut', line).text(), date),
            endDate: getTimestamp($('.Fin', line).text(), date),
            matiere: $('.Matiere', line).text().replace(/["']/, ''),
            salle: salle,
            prof: $('.Prof', line).text().replace(/["']/, ''),
            promo: promo.replace(/["']/, ''),
            etage: salle[0]
        });
    });
    return arr;
}


function getTimestamp(hour, dateString) {
    let hourArray = hour.split(':');
    const dateElements = dateString.split('/')
    let date = new Date(dateElements[2], (+dateElements[0]) - 1, dateElements[1], hourArray[0], hourArray[1]);
    return date.getTime();
}

function getCalendarForUser(user) {
    console.log(`Getting calendar for user ${user.username}`)
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
    const currentDate = new Date()
    let date = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay());
    console.log(`scrapping week from ${date.toLocaleDateString()}`)
    let resultDate;
    let urlToAdd;
    for (let i = 0; i < MAX_DAYS; i++) {
        date.setDate(date.getDate() + 1);
        resultDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
        urlToAdd = urlForUser.replace('${date}', resultDate);
        urls.push({
            url: urlToAdd,
            date: resultDate
        });
    }
    return urls
}

function writeToDb(db, documents) {
    Promise.all(documents).then((docs) => {
        console.log(`All document fetched (${docs.length}), writing to database`)
        flatArray(docs).forEach((doc) => {
            db.insert(doc.startDate, doc.endDate, doc.matiere, doc.salle, doc.prof, doc.promo, doc.etage);
        });

    }).catch(err => console.log("writeToDb  " + err));
}


function flatArray(array) {
    return array.reduce((arr, element) => {
        return arr.concat(element);
    }, [])
}