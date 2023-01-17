var con = require('../../config/db')
const util = require('util');
const query = util.promisify(con.query).bind(con);

module.exports = class SportDAO {
    async addSport(name,type){
        console.log("[INVOCAR] query1")
        const query1 = "INSERT INTO esporte (nome, tipo) VALUES ('"+name+"','"+type+"')"

        try{
            await query(query1)
        }catch(err){
            throw Error("Erro em conectar com base de dados") 
        }
    }

    async getSportType(sportID){
        console.log("[INVOCAR] query1")
        var query1 = "SELECT tipo FROM esporte WHERE idesporte = "+sportID+""
        
        try{
            var rows = await query(query1)
            return rows[0]["tipo"]
        }catch(err){
            console.log(err)
        }     
    }

    async getSports(){
        console.log("[INVOCAR] query1")
        const query1 = "SELECT idesporte, nome, tipo FROM esporte"

        try{
            var rows = await query(query1)
            return rows
        }catch(err){
            throw Error("Erro em conectar com base de dados") 
        }
    }
}