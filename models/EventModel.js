var con = require('../config/db')
const util = require('util');
const query = util.promisify(con.query).bind(con);

module.exports = {
    async setEventState(state,eventID){
        const query1 = "UPDATE evento SET state = '"+state+"' WHERE idevent = '"+eventID+"';"

        try{
            await query(query1)
        }catch(err){
            throw Error("Erro em conectar com base de dados") 
        }
    },

    async addSport(name,type){
        const query1 = "INSERT INTO esporte (nome, tipo) VALUES ('"+name+"','"+type+"')"

        try{
            await query(query1)
        }catch(err){
            throw Error("Erro em conectar com base de dados") 
        }
    },

    async addTeam(name){
        const query1 = "INSERT INTO equipa (nome) VALUES ('"+name+"')"

        try{
            await query(query1)
        }catch(err){
            throw Error("Erro em conectar com base de dados") 
        }
    },

    async addPlayer(name){
        const query1 = "INSERT INTO jogador (nome) VALUES ('"+name+"')"

        try{
            await query(query1)
        }catch(err){
            throw Error("Erro em conectar com base de dados") 
        }
    },

    async getPlayers(){
        const query1 = "SELECT idjogador as id, nome as nome FROM jogador;"

        try{
            var rows = await query(query1)
            return rows
        }catch(err){
            console.log(err)
            throw Error("Erro em conectar com base de dados") 
        }
    },

    async getTeams(){
        const query1 = "SELECT idequipa as id, nome as nome FROM equipa;"

        try{
            var rows = await query(query1)
            return rows
        }catch(err){
            throw Error("Erro em conectar com base de dados") 
        }
    },

    async addEvent(date,desportoID){
        var query1 = "INSERT INTO evento (date, state, esporte_e) VALUES ('"+date+"','o',"+desportoID+")"

        try{
            var result = await query(query1)
            return result.insertId
        }catch(err){
            throw Error("Erro em conectar com base de dados") 
        }
    },
    
    async addColetiveSportParticipants(team1ID,team2ID,eventID){
        var query1 = "INSERT INTO esporte_coletivo_adversarios (equipa1, equipa2, evento_c) VALUES ("+team1ID+","+team2ID+","+eventID+")"
        
        try{
            await query(query1)
        }catch(err){
            console.log(err)
            throw Error("Erro em conectar com base de dados") 
        }
    },

    async addDualSportParticipants(player1ID,player2ID,eventID){
        var query1 = "INSERT INTO esporte_dual_adversarios (jogador1, jogador2, evento_d) VALUES ("+player1ID+","+player2ID+","+eventID+")"
        
        try{
            await query(query1)
        }catch(err){
            console.log(err)
            throw Error("Erro em conectar com base de dados") 
        }
    },

    async addBetType(nomeTipoDeAposta,listaDeOdds,eventID){

        var listaDeOddsNomes = "("
        var listaDeOddsValores = "("
        
        listaDeOdds.forEach((odd) =>{
            listaDeOddsNomes = listaDeOddsNomes + "`" + odd["nome"] + "`,"
            listaDeOddsValores = listaDeOddsValores + odd["odd"] + ","
        })
                
        listaDeOddsNomes = listaDeOddsNomes + "`evento_" + nomeTipoDeAposta + "`)"
        listaDeOddsValores = listaDeOddsValores + eventID + ")"

        var query1 = "INSERT INTO `"+nomeTipoDeAposta+"` "+listaDeOddsNomes+" VALUES "+listaDeOddsValores
        
        try{
            await query(query1)
        }catch(err){
            console.log(err)
            throw Error("Erro em conectar com base de dados") 
        }
    },

    async createBetType(betTypeName,oddNames){
        var query1 = "CREATE TABLE `ras_database`.`"+betTypeName+"` ("+
        "`id"+betTypeName+"` INT NOT NULL AUTO_INCREMENT, "

        oddNames.forEach((oddName) => {
          query1 = query1 + "`"+oddName["oddName"]+"` DECIMAL(3,2) NOT NULL, " 
        })

        query1 = query1 + "`evento_"+betTypeName+"` INT NOT NULL, "+
        "PRIMARY KEY (`id"+betTypeName+"`), "+
        "INDEX `evento_"+betTypeName+"_idx` (`evento_"+betTypeName+"` ASC) VISIBLE, "+
        "CONSTRAINT `evento_"+betTypeName+"` "+
          "FOREIGN KEY (`evento_"+betTypeName+"`) "+
          "REFERENCES `ras_database`.`evento` (`idevent`) "+
          "ON DELETE NO ACTION "+
          "ON UPDATE NO ACTION);"

        try{
            await query(query1)
        }catch(err){
            throw Error("Erro em conectar com base de dados") 
        }
    },

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

        try{
            await query(query1)
        }catch(err){
            throw Error("Erro em conectar com base de dados") 
        }
    },

    async getEventsBySport(sportID){
        var eventos = []
        var query1 = "SELECT idevent,date,state,esporte_e FROM evento WHERE esporte_e = "+sportID
        
        try{
            var rows = await query(query1)
            for (const evento of rows){
                var idevent = evento["idevent"]
                var date = evento["date"]
                var state = evento["state"]
                var sport = evento["esporte_e"]

                eventos.push({idevent: idevent, date: date, state: state, sport:sport})
            }   

            return eventos
        }catch(err){
            console.log(err)
        }  
    },

    async getBetTypeBySport(sportID){        
        var tiposDeAposta = []

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
    },

    async getSportType(sportID){
        var query1 = "SELECT tipo FROM esporte WHERE idesporte = "+sportID+""
        
        try{
            var rows = await query(query1)
            return rows[0]["tipo"]
        }catch(err){
            console.log(err)
        }     
    },

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
    },

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
    },

    async getOddsTipoDeAposta(tipoDeAposta, eventoID){

        // Selecionar nomes das colunas
        var nomeColunas = []
        var query0 = "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = N'"+tipoDeAposta+"'"
        var resJson = ""

        try{
            var rows = await query(query0)
            var tamanhoRows = rows.length - 2
            var iter = 1
            for (const coluna of rows){
                var nomeColuna = coluna["COLUMN_NAME"]
                if(nomeColuna.substring(0,2) != "id" && nomeColuna.substring(0,6) != "evento"){
                    nomeColunas.push(nomeColuna)
                    iter++
                }
            }
        }catch(err){
            console.log(err)
        }

        // Selecionar valores das colunas
        var colunasComNomesEValores = []
        var query1 = "SELECT * FROM `"+tipoDeAposta+"` WHERE `evento_"+tipoDeAposta+"` = "+eventoID
        
        try{
            var rows = await query(query1)
            for (contentRow of rows){
                for (coluna of nomeColunas){
                    var json = {}
                    json[coluna] = contentRow[coluna]
                    colunasComNomesEValores.push({nome:coluna,valor:json[coluna]})
                }
            }
            //console.log(colunasComNomesEValores)
            return colunasComNomesEValores
        }catch(err){
            console.log(err)
        }  
    },

    async getSports(){
        const query1 = "SELECT idesporte, nome, tipo FROM esporte"

        try{
            var rows = await query(query1)
            return rows
        }catch(err){
            throw Error("Erro em conectar com base de dados") 
        }
    },

    async getSportFromEvent(eventID){
        var query1 = "SELECT esporte_e FROM evento WHERE idevent = "+eventID+""
        
        try{
            var rows = await query(query1)
            return rows[0]["esporte_e"]
        }catch(err){
            console.log(err)
        }     
    }
}