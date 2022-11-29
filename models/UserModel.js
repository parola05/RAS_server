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

    async getUserDataByEmail(email){
        var query1 = "SELECT * FROM user WHERE email = '"+email+"'"  
  
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
    },

    async addPromotion(minAmount,expDate,perElevation,eventID){
        var query1 = "INSERT INTO promotion (minAmount, expDate, perElevation, eventIDPromotion) VALUES ("+minAmount+",'"+expDate+"',"+perElevation+","+eventID+")" 
        
        try{
           await query(query1)
        }catch(err){
            console.log(err) 
            throw Error("Erro em conectar com base de dados") 
        }
    },

    async addAllUsersNotification(title,description){
        // 3 is consider the All User ID
        var query1 = "INSERT INTO notification (title, description, userID) VALUES ('"+title+"','"+description+"',3)" 
        
        try{
           await query(query1)
        }catch(err){
           console.log(err) 
           throw Error("Erro em conectar com base de dados") 
        }
    },

    async addUserNotification(title,description,userID){
        var query1 = "INSERT INTO notification (title, description, userID) VALUES ('"+title+"','"+description+"',"+userID+")" 
        
        try{
           await query(query1)
       }catch(err){
           console.log(err) 
           throw Error("Erro em conectar com base de dados") 
       }
    },

    async getNotificationsFromUser(userID){
        var query1 = "SELECT * FROM notification WHERE userid = "+userID+" OR userid = 3"  
        try{
            var rows = await query(query1)
            return rows
        }catch(err){
            console.log(err)
            throw Error("Erro em conectar com base de dados") 
        }
    },

    async addUser(username, password, email, nif, iban, birthday){
        const query1 = "INSERT INTO user (username, password, email, nif, iban, birthday, credential) VALUES ('"+username+"','"+password+"','"+email+"','"+nif+"','"+iban+"','"+birthday+"','u')"

        try{
            await query(query1)
         }catch(err){
             console.log(err) 
             throw Error("Erro em conectar com base de dados") 
         }
    },

    async setUserData(username,email,nif,iban,birthday){
        const query = "UPDATE user (username, nif, iban, birthday) SET username = "+username+", nif = "+nif+", iban = "+iban+", birthday = "+birthday+" WHERE email = "+email+""

        try{
            await query(query1)
         }catch(err){
             console.log(err) 
             throw Error("Erro em conectar com base de dados") 
         }
    }
}