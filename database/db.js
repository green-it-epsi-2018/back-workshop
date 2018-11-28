const sqlite3 = require("sqlite3").verbose();

// open the database
let db = new sqlite3.Database(
    "database/databaseScrapper.db"
);

// Create Table
db.serialize(function () {
    db.run(
        "CREATE TABLE IF NOT EXISTS HEP (DateDebut datetime, DateFin datetime, Promo string, Intervenant string, Matiere string, NumeroSalle INTEGER, NumeroEtage INTEGER ,  Status INTEGER)"
    );


});

//insert function
insert = function (startDate, endDate, matiere, salle, prof, promo,NumeroEtage) {
    db.serialize(function () {
        db.run(
            `INSERT into HEP(DateDebut,DateFin, Matiere,NumeroSalle,Intervenant,Promo,NumeroEtage) VALUES (${startDate},${endDate},"${matiere}","${salle}", "${prof}", "${promo}",${NumeroEtage} )`
        );
    });
};



// Tout le batiment
getAll = function () {
    return new Promise(function (resolve, reject) {
        db.all("SELECT * from HEP", function (err, rows) {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

// get by room
getByRoom = function (numSalle) {
    return new Promise((resolve, reject) => {
        let sql = `SELECT *
        FROM HEP
        WHERE NumeroSalle  = ?`;
        let rooomName = numSalle;

        db.all(sql, [rooomName], (err, row) => {
            if (err) {
                reject(err);
            }
            console.log("the row is : " + JSON.stringify(row));
            resolve(row);
        });
    });
};

//get by floor
getByLevel = function (floor) {
    return new Promise((resolve, reject) => {
        let sql = `SELECT * FROM HEP WHERE NumeroEtage  = ?`;
        let floorNUmber = floor;

        db.all(sql, [floorNUmber], function (err, row) {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
};

module.exports.getAll = getAll;
module.exports.getByRoom = getByRoom;
module.exports.getByLevel = getByLevel;
module.exports.insert = insert;
module.exports.close = db.close;