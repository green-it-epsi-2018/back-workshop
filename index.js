const sqlite3 = require('sqlite3').verbose()

const db = new sqlite3.Database("database/databaseScrapper.db");

// Create Table HEP
db.serialize(function () {
    db.run(
        "CREATE TABLE IF NOT EXISTS HEP (DateDebut datetime, DateFin datetime, Promo string, Intervenant string, Matiere string, NumeroSalle INTEGER, NumeroEtage INTEGER ,  Status INTEGER)"
    );
});

// Create Table INFORMATION
db.serialize(function () {
    db.run(
        "CREATE TABLE IF NOT EXISTS INFORMATION ( Information string, IMAGE string)"
    );
});

// Create Table USERS
db.serialize(function () {
    db.run(
        "CREATE TABLE IF NOT EXISTS USERS ( ID string, USERNAME string, EMAIL email, PASSWORD string, PROMO string)"
    );
});


require('./webservices/services.js')(db);
require('./scrapper/scrapper.js')(db);