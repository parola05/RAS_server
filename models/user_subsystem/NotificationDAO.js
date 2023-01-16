var con = require('../../config/db')
const util = require('util');
const query = util.promisify(con.query).bind(con);

module.exports = class NotificationDAO {
    async addNotification(title,description,userID){
        var query1 = "INSERT INTO notification (title, description, userID) VALUES ('"+title+"','"+description+"',"+userID+")" 
        
        try{
           await query(query1)
       }catch(err){
           console.log(err) 
           throw Error("Erro em conectar com base de dados") 
       }
    }

    async getNotificationsByUser(userID){
        console.log("[INVOCAR] query1")
        var query1 = "SELECT * FROM notification WHERE userid = "+userID+" OR userid = 3"  
        try{
            var rows = await query(query1)
            return rows
        }catch(err){
            console.log(err)
            throw Error("Erro em conectar com base de dados") 
        }
    }
}