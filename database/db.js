const sqlite3 = require("sqlite3").verbose();
var fs = require('fs');

// open the database
let db = new sqlite3.Database("database/databaseScrapper.db");

/**********************  HEP **************************/

// Create Table HEP
db.serialize(function () {
    db.run(
        "CREATE TABLE IF NOT EXISTS HEP (DateDebut datetime, DateFin datetime, Promo string, Intervenant string, Matiere string, NumeroSalle INTEGER, NumeroEtage INTEGER ,  Status INTEGER)"
    );
});

//insert event
insert = function (startDate, endDate, matiere, salle, prof, promo, etage) {
    db.serialize(function () {
        db.run(
            `INSERT into HEP(DateDebut,DateFin, Matiere,NumeroSalle,Intervenant,Promo,NumeroEtage) VALUES (${startDate},${endDate},"${matiere}","${salle}", "${prof}", "${promo}",${etage} )`
        );
    });
};

// delete all
deleteAll = function () {
    return new Promise((resolve, reject) => {
        db.run("DELETE FROM HEP", function (err, rows) {
            if (err) {
                reject(err);
            }
            resolve(rows);
        });
    });
};

// get all evenement
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

/**********************  Information **************************/

// Create Table INFORMATION
db.serialize(function () {
    db.run(
        "CREATE TABLE IF NOT EXISTS INFORMATION ( Information string, IMAGE string)"
    );
});

// get all Information
getAllInformation = function () {
    return new Promise(function (resolve, reject) {
        db.all("SELECT * from INFORMATION", function (err, rows) {
            if (err) {
                reject(err);
            } else {
                console.log("getAllInformation length is : " + rows.length);

                resolve(rows);
            }
        });
    });
};

// function to encode file data to base64 encoded string
function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}


var base64strCampus = base64_encode('Pics/campus.jpg');
var base64strWk = base64_encode('Pics/wk.jpg');
var base64strWk2 = base64_encode('Pics/wk2.jpg');



insertInformation = function () {

    console.log("getAllInformation is equal to zero " + getAllInformation.length);


    //Insert information into database
    db.run(
        `INSERT INTO INFORMATION(INFORMATION, IMAGE) VALUES(?,?)`,
        ["Campus HEP NANTES ", base64strCampus],
        function (err) {
            if (err) {
                return console.log("iam error : " + err.message);
            }
            console.log("insert information  is OK ");
        }
    );

    //Insert information into database 
    db.run(
        `INSERT INTO INFORMATION(INFORMATION, IMAGE) VALUES(?,?)`,
        ["Le prochaine workshop sera le 04/02/2019", base64strWk],
        function (err) {
            if (err) {
                return console.log("iam error : " + err.message);
            }
            console.log("insert information  is OK ");
        }
    );

    //Insert information into database 
    db.run(
        `INSERT INTO INFORMATION(INFORMATION, IMAGE) VALUES(?,?)`,
        ["Il y a une réunion groupe dans la salle 200 à 10h", base64strWk2],
        function (err) {
            if (err) {
                return console.log("iam error : " + err.message);
            }
            console.log("insert information  is OK ");
        }
    );

    //Insert information into database 

    db.run(
        `INSERT INTO INFORMATION(INFORMATION, IMAGE) VALUES(?,?)`,
        ["Un workshop est un mot anglais qui désigne un atelier axé sur un thème de travail au sein d'un congrès ou d'un salon professionnel. La présence du suffixe -shop induit en erreur et peut faire penser à un commerce", ''],
        function (err) {
            if (err) {
                return console.log("iam error : " + err.message);
            }
            console.log("insert information  is OK ");
        }
    );

}




module.exports.getAll = getAll;
module.exports.getByRoom = getByRoom;
module.exports.getByLevel = getByLevel;
module.exports.insert = insert;
module.exports.close = db.close;
module.exports.deleteAll = deleteAll;
module.exports.getAllInformation = getAllInformation;
module.exports.insertInformation = insertInformation;