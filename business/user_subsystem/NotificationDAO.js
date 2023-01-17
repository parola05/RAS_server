var con = require('../../config/db')
const util = require('util');
const query = util.promisify(con.query).bind(con);

module.exports = class NotificationDAO {
    
    subjects = []

    constructor(subjects){
        this.subjects = subjects 
        
        for (const subject in subjects){
            if (subject && typeof(this.subjects[subject].registerObserver) == "function"){
                this.subjects[subject].registerObserver(this)
            }
        }
    }

    async update(users, title, description){
        console.log("[INVOCAR] addNotification() for each user")
        for (const user of users){
            console.log("[INVOCAR] addNotification for user " + user)
            await this.addNotification(title, description, user)
        }
    }
    
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