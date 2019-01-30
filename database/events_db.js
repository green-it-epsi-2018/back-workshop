module.exports = class EventsDatabase{
    constructor(db){
        this.db = db;
    }
    
    //insert event
    insert(startDate, endDate, matiere, salle, prof, promo, etage) {
        this.db.serialize(() => {
            this.db.run(
                `INSERT into HEP(DateDebut,DateFin, Matiere,NumeroSalle,Intervenant,Promo,NumeroEtage) VALUES (${startDate},${endDate},"${matiere}","${salle}", "${prof}", "${promo}",${etage} )`
            );
        });
    }

    // delete all
    deleteAll () {
        return new Promise((resolve, reject) => {
            this.db.run("DELETE FROM HEP", function (err, rows) {
                if (err) {
                    reject(err);
                }
                resolve(rows);
            });
        });
    };

    // get all evenement
    getAll () {
        return new Promise(function (resolve, reject) {
            this.db.all("SELECT * from HEP", function (err, rows) {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    };

    // get by room
    getByRoom (numSalle) {
        return new Promise((resolve, reject) => {
            let sql = `SELECT *
            FROM HEP
            WHERE NumeroSalle  = ?`;
            let rooomName = numSalle;

            this.db.all(sql, [rooomName], (err, row) => {
                if (err) {
                    reject(err);
                }
                resolve(row);
            });
        });
    };

    //get by floor
    getByLevel (floor) {
        return new Promise((resolve, reject) => {
            let sql = `SELECT * FROM HEP WHERE NumeroEtage  = ?`;
            let floorNUmber = floor;

            this.db.all(sql, [floorNUmber], function (err, row) {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    };

    // get all Information
    getAllInformation () {
        return new Promise((resolve, reject) => {
            this.db.all("SELECT * from INFORMATION", function (err, rows) {
                if (err) {
                    reject(err);
                } else {


                    resolve(rows);
                }
            });
        });
    };

    // function to encode file data to base64 encoded string
    base64_encode(file) {
        // read binary data
        var bitmap = fs.readFileSync(file);
        // convert binary data to base64 encoded string
        return new Buffer(bitmap).toString('base64');
    }

    insertInformation () {
        var base64strCampus = base64_encode('Pics/campus.jpg');
        var base64strWk = base64_encode('Pics/wk.jpg');
        var base64strWk2 = base64_encode('Pics/wk2.jpg');

        //Insert information into database
        this.db.run(
            `INSERT INTO INFORMATION(INFORMATION, IMAGE) VALUES(?,?)`,
            ["Campus HEP NANTES ", base64strCampus],
            function (err) {
                if (err) {
                    return console.log("iam error : " + err.message);
                }

            }
        );

        //Insert information into database 
        this.db.run(
            `INSERT INTO INFORMATION(INFORMATION, IMAGE) VALUES(?,?)`,
            ["Le prochaine workshop sera le 04/02/2019", base64strWk],
            function (err) {
                if (err) {
                    return console.log("iam error : " + err.message);
                }

            }
        );

        //Insert information into database 
        this.db.run(
            `INSERT INTO INFORMATION(INFORMATION, IMAGE) VALUES(?,?)`,
            ["Il y a une réunion groupe dans la salle 200 à 10h", base64strWk2],
            function (err) {
                if (err) {
                    return console.log("iam error : " + err.message);
                }

            }
        );

        //Insert information into database 

        this.db.run(
            `INSERT INTO INFORMATION(INFORMATION, IMAGE) VALUES(?,?)`,
            ["Un workshop est un mot anglais qui désigne un atelier axé sur un thème de travail au sein d'un congrès ou d'un salon professionnel. La présence du suffixe -shop induit en erreur et peut faire penser à un commerce", ''],
            function (err) {
                if (err) {
                    return console.log("iam error : " + err.message);
                }

            }
        );

    }
}