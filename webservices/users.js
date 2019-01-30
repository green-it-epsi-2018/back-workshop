const UserDatabase = require('../database/user_db');
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = (app, db) => {
    const userDatabase = new UserDatabase(db);

    app.post('/users/register', (req, res) => {
        const {username, email, password, promo} = req.body || {};
        if([username, email, password, promo].some(p => !p)) {
            return res.status(400).send("Missing parameter");
        }
        if(!email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
            return res.status(400).send("Wrong email format");
        }
        if(!password.match(/^[A-F0-9]{64}$/)) {
            return res.status(400).send("Wrong password format");
        }
        try{
            bcrypt.hash(password, saltRounds, (err, hash) => {
                if(err){
                    return res.status(500).send("Impossible to hash the password");
                }
                userDatabase.createUser(username, email, hash, promo)
                    .then(user => res.status(200).send(JSON.stringify(user)));
            });
        }
        catch(e){
            return res.status(500).send("Error while registrering the user");
        }
    });

};