const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const port = process.env.PORT || 3000;
var fs = require('fs');

module.exports = db => {
    require('./events')(app, db);
    require('./users')(app, db);

    app.listen(port, () => {
        console.log('Webservice app is listening');
    });
};