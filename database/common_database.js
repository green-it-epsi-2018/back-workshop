class DatabaseError extends Error{
    constructor(message) {
        super(`[DATABASE ERROR] ${message}`);

        this.name = this.constructor.name;

        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        } else { 
            this.stack = (new Error(message)).stack; 
        }
    }
}

class Database{
    constructor(db){
        this.db = db;
    }

    async get(query, parameters){
        return new Promise((res) => this.db.get(query, parameters, (err, rows) => {
            if(err){
                throw new DatabaseError(err);
            }
            res(rows)
        }))
    }

    async all(query, parameters){
        return new Promise((res) => this.db.all(query, parameters, (err, rows) => {
            if(err){
                throw new DatabaseError(err);
            }
            res(rows)
        }))
    }
}

module.exports = {
    DatabaseError,
    Database  
}