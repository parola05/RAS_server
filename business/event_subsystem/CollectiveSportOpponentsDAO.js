var con = require('../../config/db')
const util = require('util');
const query = util.promisify(con.query).bind(con);

module.exports = class CollectiveSportOpponentsDAO {
    async addColetiveSportParticipants(team1ID,team2ID,eventID){

        console.log("[INVOCAR] query1")
        var query1 = "INSERT INTO esporte_coletivo_adversarios (equipa1, equipa2, evento_c) VALUES ("+team1ID+","+team2ID+","+eventID+")"
        
        try{
            await query(query1)
        }catch(err){
            console.log(err)
            throw Error("Erro em conectar com base de dados") 
        }
    }

    async getTeamsFromColetiveEvent(eventID){
        var query1 = "SELECT equipa1,equipa2 FROM esporte_coletivo_adversarios WHERE evento_c = "+eventID+""
        
        try{
            var rows = await query(query1)
            for (const equipa of rows){
                var equipas = {equipa1: equipa["equipa1"], equipa2: equipa["equipa2"]}
            }   

            var query2 = "SELECT nome FROM equipa WHERE idequipa = "+equipas["equipa1"]
            try{
                var equipasNomes = {}
                var rows = await query(query2)

                for (const equipa of rows){
                    equipasNomes["equipa1Nome"] = equipa["nome"]
                }  

                var query3 = "SELECT nome FROM equipa WHERE idequipa = "+equipas["equipa2"]

                try{
                    var rows = await query(query3)

                    for (const equipa of rows){
                        equipasNomes["equipa2Nome"] = equipa["nome"]
                    } 

                    return equipasNomes
                }catch(err){
                    console.log(err)                    
                }
            }catch(err){
                console.log(err)
            }
        }catch(err){
            console.log(err)
        }  
    }
}