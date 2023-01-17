var con = require('../../config/db')
const util = require('util');
const query = util.promisify(con.query).bind(con);

module.exports = class PlayerDAO {
    async addPlayer(name){
        console.log("[INVOCAR] query1")
        const query1 = "INSERT INTO jogador (nome) VALUES ('"+name+"')"

        try{
            await query(query1)
        }catch(err){
            throw Error("Erro em conectar com base de dados") 
        }
    }

    async getPlayers(){
        console.log("[INVOCAR] query1")
        const query1 = "SELECT idjogador as id, nome as nome FROM jogador;"

        try{
            var rows = await query(query1)
            return rows
        }catch(err){
            console.log(err)
            throw Error("Erro em conectar com base de dados") 
        }
    }
}