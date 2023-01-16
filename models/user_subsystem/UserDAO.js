var con = require('../../config/db')
const util = require('util');
const query = util.promisify(con.query).bind(con);

module.exports = class UserDAO {

    observers = []

    registerObserver(observer){
        console.log("[INVOCAR] this.observers.push with " + observer)
        this.observers.push(observer)
    }

    removeObserver(observer){
        this.observers.splice(this.observers.findIndex(observer),1)
    }

    async notifyAll(type,amount,userID){
        console.log("[INVOCAR] for (o of this.observers) with " + this.observers.length)
        for (const o of this.observers){
            console.log("[INVOCAR] typeof(o.pudate) == function")
            if (typeof(o.update) == "function"){
                console.log("[INVOCAR] update()")
                await o.update(type,amount,userID)
            }
        }
    }

    async addUser(username, password, email, nif, iban, birthday){
        console.log("[INVOCAR] query1")
        const query1 = "INSERT INTO user (username, password, email, nif, iban, birthday, credential) VALUES ('"+username+"','"+password+"','"+email+"','"+nif+"','"+iban+"','"+birthday+"','u')"

        try{
            await query(query1)
        }catch(err){
            console.log(err) 
            throw Error("Erro em conectar com base de dados") 
        }
    }

    async getUsers(){
        var query1 = "SELECT email,credential FROM user;"  

        try{
            var rows = await query(query1)
            if (rows.length!=0){
                return rows;
            }else{
                throw Error("Não há utilizadores no sistema")
            }
        }catch(err){
            throw Error("Erro em conectar com base de dados") 
        }
    }

    async getUserByID(userID){
        var query1 = "SELECT * FROM user WHERE iduser = "+userID+""  
  
        try{
            var rows = await query(query1)
            return rows[0]
        }catch(err){
            console.log(err)
            throw Error("Erro em conectar com base de dados") 
        }
    }

    async getUserByEmail(email){
        console.log("[INVOCAR] query1 with " + email)
        var query1 = "SELECT * FROM user WHERE email = '"+email+"'"  
  
        try{
            var rows = await query(query1)
            return rows[0]
        }catch(err){
            console.log(err)
            throw Error("Erro em conectar com base de dados") 
        }
    }

    async setUserSpe(userEmail){

        const query1 = "UPDATE user SET credential = 's' WHERE email = '"+userEmail+"';"

        try{
            await query(query1)
        }catch(err){
            console.log(err)
            throw Error("Erro em conectar com base de dados") 
        }
    }

    async setUserAdmin(userEmail){

        const query1 = "UPDATE user SET credential = 'a' WHERE email = '"+userEmail+"';"

        try{
            await query(query1)
        }catch(err){
            throw Error("Erro em conectar com base de dados") 
        }
    }

    async setUserData(username,email,nif,iban,birthday){
        const query1 = "UPDATE user (username, nif, iban, birthday) SET username = "+username+", nif = "+nif+", iban = "+iban+", birthday = "+birthday+" WHERE email = "+email+""

        try{
            await query(query1)
         }catch(err){
            console.log(err) 
            throw Error("Erro em conectar com base de dados") 
         }
    }

    async setBalance(newBalance, type, amount,userID){
        console.log("[INVOCAR] _setBalance()")
        await this._setBalance(newBalance,userID)
        console.log("[INVOCAR] notifiyAll()")
        this.notifyAll(type,amount,userID)
    }

    async _setBalance(newBalance,userID){
        console.log("[INVOCAR] query1")
        var query1 = "UPDATE user SET balance = "+newBalance+" WHERE iduser = "+userID+""

        try{
            await query(query1)
        }catch(err){
            console.log(err)
            throw Error("Erro em conectar com base de dados") 
        }
    }
}