const sqlite3 = require('sqlite3').verbose();


// open the database
let db = new sqlite3.Database('/Users/Tshili/Documents/Project/back-workshop/database/databaseScrapper.db');


// Create Table  
db.serialize(function () {
    db.run("CREATE TABLE IF NOT EXISTS HEP (DateDebut datetime, DateFin datetime, Promo string, Intervenant string, Matiere string, NumeroSalle INTEGER, NumeroEtage INTEGER   Status INTEGER)");
});

// insert function 
insert = function () {

    let db = new sqlite3.Database('/Users/Tshili/Documents/Project/back-workshop/database/databaseScrapper.db');

    db.serialize(function () {
        db.run("INSERT into HEP(Promo,Intervenant,NumeroSalle,NumeroEtage, Matiere) VALUES ('I5','Bernard',200,2, 'pilotage de  projet')");
        db.run("INSERT into HEP(Promo,Intervenant, NumeroSalle,NumeroEtage, Matiere) VALUES ('Wiz','Hugo',300,3,'Gestion de projet')");
    });
}



// Tout le batiment 
getAll = function () {

    let db = new sqlite3.Database('/Users/Tshili/Documents/Project/back-workshop/database/databaseScrapper.db');

    return new Promise(function (resolve, reject) {
        db.all("SELECT * from HEP", function (err, rows) {
            if (err) {
                reject(err)
            } else {


                resolve(rows);

            }
        });
    })
}



// get by room 
getByRoom = function (numSalle) {

    let db = new sqlite3.Database('/Users/Tshili/Documents/Project/back-workshop/database/databaseScrapper.db');
    return new Promise((resolve, reject) => {
        let sql = `SELECT *
        FROM HEP
        WHERE NumeroSalle  = ?`;
        let rooomName = numSalle;

        db.all(sql, [rooomName], (err, row) => {
            if (err) {
                reject(err)
            }
            console.log("the row is : " + JSON.stringify(row));
            resolve(row);



        });

    })


}


//get by floor
getByLevel = function (floor) {

    let db = new sqlite3.Database('/Users/Tshili/Documents/Project/back-workshop/database/databaseScrapper.db');

    return new Promise((resolve, reject) => {

        let sql = `SELECT * FROM HEP WHERE NumeroEtage  = ?`;
        let floorNUmber = floor;

        db.all(sql, [floorNUmber],
            function (err, row) {
                if (err) {
                    reject(err);
                } else {
                    resolve(row)
                }
            });

    })

}


// close the database connection
db.close();

module.exports.getAll = getAll
module.exports.getByRoom = getByRoom
module.exports.getByLevel = getByLevel
module.exports.insert = insert