var con = require('../../config/db')
const util = require('util');
const query = util.promisify(con.query).bind(con);

module.exports = class EventFollowers {
    async getFollowersByEvent(eventID){
        var query1 = "SELECT * FROM evento_seguidores WHERE evento_ID = "+eventID+""  
  
        try{
            var rows = await query(query1)
            
            var user_id_rows = []
            for (const row of rows){
                user_id_rows.push(row.user_ID)
            }
            
            return user_id_rows
        }catch(err){
            console.log(err)
            throw Error("Erro em conectar com base de dados") 
        }
    }

    async addFollowerOfEvent(userID, eventID){
        const query1 = "INSERT INTO evento_seguidores (evento_ID, user_ID) VALUES ('"+eventID+"','"+userID+")"

        try{
            await query(query1)
        }catch(err){
            console.log(err) 
            throw Error("Erro em conectar com base de dados") 
        }      
    }

    async removeFollowerOfEvent(userID, eventID){
        const query1 = "DELETE FROM evento_seguidores WHERE user_ID = " + userID + " AND evento_ID = " + eventID

        try{
            await query(query1)
        }catch(err){
            console.log(err) 
            throw Error("Erro em conectar com base de dados") 
        }      
    }
}