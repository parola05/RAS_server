var con = require('../../config/db')
const util = require('util');
const query = util.promisify(con.query).bind(con);

module.exports = class SportBetTypesDAO {
    async addBetTypeToSports(sportsID,betTypeName){
        var query1 = "INSERT INTO esportes_tipo_de_apostas (esporte,tipo_de_aposta) VALUES "
        var sportsSize = sportsID.length
        var i = 1

        sportsID.forEach((sportID) => {
            if (i == sportsSize)
                query1 += "("+sportID["sportID"]+",'"+betTypeName+"'); " 
            else 
                query1 += "("+sportID["sportID"]+",'"+betTypeName+"'), " 
            i++
        })    

        console.log("[INVOCAR] query1")
        try{
            await query(query1)
        }catch(err){
            throw Error("Erro em conectar com base de dados") 
        }
    }

    async getBetTypeBySport(sportID){        
        var tiposDeAposta = []

        console.log("[INVOCAR] query1")
        var query1 = "SELECT tipo_de_aposta FROM esportes_tipo_de_apostas WHERE esporte = "+sportID+""
        
        try{
            var rows = await query(query1)

            for (const tipoDeAposta of rows){
                tiposDeAposta.push(tipoDeAposta["tipo_de_aposta"])
            }   
            
            return tiposDeAposta
        }catch(err){
            console.log(err)
        }  
    }
}