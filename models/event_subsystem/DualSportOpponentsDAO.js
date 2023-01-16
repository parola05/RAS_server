var con = require('../../config/db')
const util = require('util');
const query = util.promisify(con.query).bind(con);

module.exports = class DualSportOpponentsDAO {
    async addDualSportParticipants(player1ID,player2ID,eventID){

        console.log("[INVOCAR] query1")
        var query1 = "INSERT INTO esporte_dual_adversarios (jogador1, jogador2, evento_d) VALUES ("+player1ID+","+player2ID+","+eventID+")"
        
        try{
            await query(query1)
        }catch(err){
            console.log(err)
            throw Error("Erro em conectar com base de dados") 
        }
    }

    async getPlayersFromDualEvent(eventID){
        var query1 = "SELECT jogador1,jogador2 FROM esporte_dual_adversarios WHERE evento_d = "+eventID+""
        
        try{
            var rows = await query(query1)
            for (const jogador of rows){
                var jogadores = {jogador1: jogador["jogador1"], jogador2: jogador["jogador2"]}
            }   

            var query2 = "SELECT nome FROM jogador WHERE idjogador = "+jogadores["jogador1"]
            try{
                var jogadoresNomes = {}
                var rows = await query(query2)

                for (const jogador of rows){
                    jogadoresNomes["jogador1Nome"] = jogador["nome"]
                }  

                var query3 = "SELECT nome FROM jogador WHERE idjogador = "+jogadores["jogador2"]

                try{
                    var rows = await query(query3)

                    for (const jogador of rows){
                        jogadoresNomes["jogador2Nome"] = jogador["nome"]
                    } 

                    return jogadoresNomes
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