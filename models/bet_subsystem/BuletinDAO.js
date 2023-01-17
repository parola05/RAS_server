var con = require('../../config/db')
const util = require('util');
const query = util.promisify(con.query).bind(con);

module.exports = class BuletinDAO {
    async addBuletin(amount,gain,type,userID){
        console.log("[INVOCAR] query1")
        const query1 = "INSERT INTO buletin (amount, gain, type, user_buletin) VALUES ("+amount+","+gain+",'"+type+"',"+userID+")" 

        try{
            var result = await query(query1)
            return result.insertId
        }catch(err){
            console.log(err)
            throw Error("Erro em conectar com base de dados") 
        }
    }    

    async getBuletinType(buletinID){
        console.log("[INVOCAR] query1")
        var query1 = "SELECT type FROM buletin WHERE idbuletin = "+buletinID

        try{
            var rows = await query(query1)
            return rows[0]["type"]
        }catch(error){
            console.log(err)
        }
    }

    async getBuletinsFromUser(userID){    
        console.log("[INVOCAR] query1")  
        var query1 = "SELECT * FROM buletin WHERE user_buletin = "+userID 

        try{
            var rows = await query(query1)
            return rows
        }catch(err){
            console.log(err)
            throw Error("Erro em conectar com base de dados") 
        }
    }

    async getUserFromBuletin(buletinID){
        var query1 = "SELECT user_buletin FROM buletin WHERE idbuletin = "+buletinID

        try{
            var rows = await query(query1)
            return rows[0]["user_buletin"]
        }catch(error){
            console.log(err)
        }   
    }

    async getBuletinGain(buletinID){
        var query1 = "SELECT gain FROM buletin WHERE idbuletin = "+buletinID

        try{
            var rows = await query(query1)
            return rows[0]["gain"]
        }catch(error){
            console.log(err)
        }    
    }
}