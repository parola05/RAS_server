var con = require('../config/db')
const util = require('util');
const query = util.promisify(con.query).bind(con);

module.exports = {
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
    },

    async setUserAdmin(userEmail){

        const query1 = "UPDATE user SET credential = 'a' WHERE email = '"+userEmail+"';"

        try{
            await query(query1)
        }catch(err){
            throw Error("Erro em conectar com base de dados") 
        }
    },

    async setUserSpe(userEmail){

        const query1 = "UPDATE user SET credential = 's' WHERE email = '"+userEmail+"';"

        try{
            await query(query1)
        }catch(err){
            console.log(err)
            throw Error("Erro em conectar com base de dados") 
        }
    },

    async getUserData(userID){
  
        var query1 = "SELECT * FROM user WHERE iduser = "+userID+""  
  
        try{
            var rows = await query(query1)
            return rows[0]
        }catch(err){
            console.log(err)
            throw Error("Erro em conectar com base de dados") 
        }
    },

    async setUserBalance(newBalance,userID){
        var query1 = "UPDATE user SET balance = "+newBalance+" WHERE iduser = "+userID+""

        try{
            await query(query1)
        }catch(err){
            throw Error("Erro em conectar com base de dados") 
        }
    },

    async addUserTransaction(transactionType,amount,userID){
        var query1 = "INSERT INTO transaction (user, type, amout) VALUES ("+userID+",'"+transactionType+"',"+amount+")" 
        
         try{
            await query(query1)
        }catch(err){
            throw Error("Erro em conectar com base de dados") 
        }
    },

    async getUserTransactions(userID){
        const query1 = "SELECT type, date, amout FROM transaction WHERE user = "+userID+""
        
         try{
            const rows = await query(query1)
            return rows
        }catch(err){
            throw Error("Erro em conectar com base de dados") 
        }
    }
}