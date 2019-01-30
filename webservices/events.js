const EventsDatabase = require('../database/events_db');

module.exports = (app, db) => {
    const dbEvents = new EventsDatabase(db);

    app.get('/data/building', (req, res) => {
        dbEvents.getAll().then((data) =>
            res.send(data)).catch(err => console.log("building road error : " + err));
    });

    app.get('/data/level/:levelNumber', (req, res) => {
        dbEvents.getByLevel(req.params.levelNumber).then(data => res.send(data)).catch(err => console.log(err));

    });

    app.get('/data/room/:roomNumber', (req, res) => {
        dbEvents.getByRoom(req.params.roomNumber).then((data) => res.send(data)).catch((err) => console.log("errr room function : " + err));
    });


    app.get('/data/information', (req, res) => {
        dbEvents.getAllInformation().then((data) => {
            if (data.length == 0) {
                console.log("iam the dbEvents.insertInformation() " + dbEvents.insertInformation());

                data.push(dbEvents.insertInformation());
                res.send(data);
            } else {
                res.send(data)
            }
        }).catch(err => console.log("information road error : " + err));
    });

};