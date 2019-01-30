const {Database, DatabaseError} = require('./common_database');
const queries = require('./user_queries');
const uuidv4 = require('uuid/v4');

class UserDatabaseError extends DatabaseError{
    constructor(message){
        super(`[USER] ${message}`);
    }
}

class UserDatabase extends Database{
    constructor(db){
        super(db)
    }

    async createUser ($username, $email, $password, $promo){
        const $id = uuidv4();
        try{
            await this.db.run(queries.create_user, {
                $id,
                $username,
                $email,
                $password,
                $promo
            });
            console.log(`User ${$username} (${$id}) created .`);
            return await this.getUserFromId($id);
        }
        catch(e){
            throw new UserDatabaseError(e.message);
        }
    }

    async getUserFromUserPass($username, $password){
        try{
            const user = await this.get(queries.get_user_from_user_pass, {
                $username,
                $password
            });
            console.log(`User ${user.username} fetched from ${$username} and ${$password} .`);
            return user;
        }
        catch(e){
            throw new UserDatabaseError(e.message);
        }
    }

    async getUserFromId($id){
        try{
            const user = await this.get(queries.get_user_from_id, {$id});
            console.log(`User ${user.USERNAME} fetched from ${$id} .`);
            return user;
        }
        catch(e){
            throw new UserDatabaseError(e.message);
        }
    }
}

module.exports = UserDatabase;