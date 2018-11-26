/*
*	CONFIG
*/
require('dotenv').config()
const REQUIRED_ENV = ['PAGE_URL', 'COOKIE_ZOPEID', 'COOKIE_AC', 'DURATION_TO_GET_IN_DAYS']
if(REQUIRED_ENV.map((cookieKey) => process.env[cookieKey]).some((cookieValue) => cookieValue === undefined)){
	throw `Erreur, les variables d'environnement suivantes sont nécessaires: ${REQUIRED_ENV.join(' , ')}`
}

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
}})
const cheerio = require('cheerio')
const ics = require('ics')

/*
*	CONSTANTS CONFIGURATION
*/
const PAGE_URL = process.env['PAGE_URL']
const getPageForDate = (date) => PAGE_URL.replace('[DATE]', new Date(date).toLocaleDateString('en-US'))

const _COOKIES = ({
	'_ZopeId': process.env['COOKIE_ZOPEID'],
	'__ac': process.env['COOKIE_AC']
})
const COOKIES = Object.keys(_COOKIES).reduce((acc, curr) => acc += `${curr}=${_COOKIES[curr]}; `, "")

const CELLS_CSS_SELECT = "#DivBody .Case:not(:last-of-type)"
const CELLS_CSS_SUB_SELECT = "table.TCase"
const CELLS_OBJECT_PARAMETERS = [['content', 'TCase'], ['professor', 'TCProf'], ['time', 'TChdeb'], ['room', 'TCSalle']]
const getCollumnIndexFromLeftMargin = (margin) => Math.floor((margin - 103.12) / 19.04)
const getFirstDateWeek = (date) => {
	  date = new Date(date);
  var day = date.getDay(),
      diff = date.getDate() - day + (day == 0 ? -6 : 1);
  return new Date(date.setDate(diff));
}
const GetDateFromDateAndCollumn = (date, collumn) => {
	date = new Date(date)
	const MondayDate = getFirstDateWeek(date)
	date.setDate(date.getDate() + collumn)
	return date
}
const CLASSES = ['B1', 'B2', 'B3', 'I4', 'I5']
const capitalizeFirstLetterEachWord = (phrase) => phrase.split(' ').map((word) => word.charAt(0).toUpperCase() + word.substr(1)).join(' ')

const DURATION_TO_GET_IN_DAYS = +process.env['DURATION_TO_GET_IN_DAYS']

/*
*	FETCHING DATA
*	
*	FORMATTING DATA
*/	

//const SELECTED_DATE = new Date()

Promise.all(Array(Math.ceil(DURATION_TO_GET_IN_DAYS / 7)).fill()
	.map((_, i) => new Date(new Date().setDate(new Date().getDate() + i * 7)))
	.map((SELECTED_DATE) => axios.get(getPageForDate(SELECTED_DATE), {withCredentials: true, headers: {Cookie: COOKIES}})
		.catch((error) => {
			console.error(`[error axios] [${SELECTED_DATE.toLocaleDateString('en-US')}]\n${error}`)
			return Promise.resolve(null)
		})
		.then(response => {
			let data = []
			if(response){
				const $ = cheerio.load(response.data)
				data = ($(CELLS_CSS_SELECT)
					.map((index, element) => ({
						color: $(element).css('background-color'),
						day: GetDateFromDateAndCollumn(getFirstDateWeek(SELECTED_DATE), getCollumnIndexFromLeftMargin($(element).css('left').slice(0, -1))).toLocaleDateString('en-US'),
						...CELLS_OBJECT_PARAMETERS
							.reduce((acc, curr) => ({
								...acc,
								[curr[0]]: $(element).find(`${CELLS_CSS_SUB_SELECT} .${curr[1]}`).text()
							}), {})
					})))
					.get()
			}
			console.log("done for "+SELECTED_DATE.toLocaleDateString('en-US'))
			return Promise.resolve(data)
		})
	)
)
.then((eventsDataList) => [].concat.apply([], eventsDataList))
.then((data) => {
	const events = data.filter((cell) => cell.content !== "").map((cell) => {
		const times = cell.time.split(' - ')
		const [startDate, endDate] = Array(2).fill().map((_, i) => new Date(new Date(cell.day).setHours(...times[i].split(':'))))
		const room = cell.room.split(':')[1]
		const professor = capitalizeFirstLetterEachWord(cell.professor.split(new RegExp(CLASSES.join('|'), 'g'))[0])
		return {
			start: [startDate.getFullYear(), startDate.getMonth()+1, startDate.getDate(), startDate.getHours(), startDate.getMinutes()],
			duration: {hours: endDate.getHours() - startDate.getHours(), minutes: endDate.getMinutes() - startDate.getMinutes()},
			title: capitalizeFirstLetterEachWord(cell.content),
			location: room,
			description: professor,
		}
	})
	//console.log(events)
	return Promise.resolve(events)
})
.then((events) => {
	const {error, value} = ics.createEvents(events)
	if(error){
		throw error
	}
	fs.writeFileSync('events.ics', value)
	console.log("Done !")
})
.catch((error) => console.error(error))
