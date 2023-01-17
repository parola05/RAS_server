var con = require('../../config/db')
const util = require('util');
const query = util.promisify(con.query).bind(con);

module.exports = class TeamDAO {
    async addTeam(name){
        console.log("[INVOCAR] query1")
        const query1 = "INSERT INTO equipa (nome) VALUES ('"+name+"')"

        try{
            await query(query1)
        }catch(err){
            throw Error("Erro em conectar com base de dados") 
        }
    }

    async getTeams(){
        console.log("[INVOCAR] query1")
        const query1 = "SELECT idequipa as id, nome as nome FROM equipa;"

        try{
            var rows = await query(query1)
            return rows
        }catch(err){
            throw Error("Erro em conectar com base de dados") 
        }
    }
}