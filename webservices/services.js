const express = require('express');
const dbConnector = "Hello world";
const app = express();
const port = process.env.PORT || 3000;


app.get('/data/building',(req, res)=> {
    res.send(getEventList());
});

app.get('/data/level', (req, res)=> {
    res.send(getEventList());
});

app.get('/data/room', (req, res) => {
    res.send(getEventList());
});

app.listen(port, ()=> {
    console.log('app is listening');
});

function getEventList() {
    return dbConnector;
}


