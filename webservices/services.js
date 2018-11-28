const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const db = require('../database/db.js');





app.get('/data/building', (req, res) => {
    db.getAll().then((data) =>
        res.send(data)).catch(err => console.log("eeeeeerrrrr : " + err));
});

app.get('/data/level/:levelNumber', (req, res) => {
    db.getByLevel(req.params.levelNumber).then(data => res.send(data)).catch(err => console.log(err));

});

app.get('/data/room/:roomNumber', (req, res) => {
    db.getByRoom(req.params.roomNumber).then((data) => res.send(data)).catch((err) => console.log("errr room function : " + err));
});


app.listen(port, () => {
    console.log('app is listening');
});