const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const db = require('../database/db.js');


app.get('/data/building', (req, res) => {
    console.log("Webservice request for building data")
    db.getAll().then((data) =>
        res.send(data)).catch(err => console.log("eeeeeerrrrr : " + err));
});

app.get('/data/level/:levelNumber', (req, res) => {
    console.log("Webservice request for level data")
    db.getByLevel(req.params.levelNumber).then(data => res.send(data)).catch(err => console.log(err));

});

app.get('/data/room/:roomNumber', (req, res) => {
    console.log("Webservice request for room data")
    db.getByRoom(req.params.roomNumber).then((data) => res.send(data)).catch((err) => console.log("errr room function : " + err));
});


app.get('/data/information', (req, res) => {
    console.log("Get information")
    db.getAllInformation().then((data) =>
        res.send(data)).catch(err => console.log("eeeeeerrrrr : " + err));
});



app.listen(port, () => {
    console.log('Webservice app is listening');
});