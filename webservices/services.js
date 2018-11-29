const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const db = require('../database/db.js');


app.get('/data/building', (req, res) => {
    db.getAll().then((data) =>
        res.send(data)).catch(err => console.log("building road error : " + err));
});

app.get('/data/level/:levelNumber', (req, res) => {
    db.getByLevel(req.params.levelNumber).then(data => res.send(data)).catch(err => console.log(err));

});

app.get('/data/room/:roomNumber', (req, res) => {
    db.getByRoom(req.params.roomNumber).then((data) => res.send(data)).catch((err) => console.log("errr room function : " + err));
});


app.get('/data/information', (req, res) => {

    db.getAllInformation().then((data) => {
        if (data.length == 0) {
            console.log("iam the db.insertInformation() " + db.insertInformation());

            data.push(db.insertInformation());
            res.send(data);
        } else {
            res.send(data)
        }
    }).catch(err => console.log("information road error : " + err));
});



app.listen(port, () => {
    console.log('Webservice app is listening');
});