var con = require('../config/db')
const util = require('util');

var helpers = {

    async writeOdd(query2){
        const query = util.promisify(con.query).bind(con);
        var resJson = ""

        try{
            var rows = await query(query2)
            var tamanhoRows = rows.length - 2
            var iter = 1
            for (const coluna of rows){
                var nomeColuna = coluna["COLUMN_NAME"]
                if(nomeColuna.substring(0,2) != "id" && nomeColuna.substring(0,6) != "evento"){
                    if (iter == tamanhoRows){
                        resJson = resJson + '{ "nome": "' + nomeColuna + '", "odd": -1 }'
                    }
                    else{
                        resJson = resJson + '{ "nome": "' + nomeColuna + '", "odd": -1 },'
                    }
                    iter++
                }
            }
        }catch(err){
            console.log(err)
        }
        return resJson
    },

    async getEventosDoDesporto(sportID){
        const query = util.promisify(con.query).bind(con);
        var eventos = []
        
        var query1 = "SELECT idevent,date,state FROM evento WHERE esporte_e = "+sportID
        
        try{
            var rows = await query(query1)
            for (const evento of rows){
            var idevent = evento["idevent"]
            var date = evento["date"]
            var state = evento["state"]

            eventos.push({idevent: idevent, date: date, state: state})
            }   

            return eventos
        }catch(err){
            console.log(err)
        }  
    },

    async getTiposDeApostaDoDesporto(sportID){
        const query = util.promisify(con.query).bind(con);
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

    async getEquipasDoEventoColetivo(eventoID){
        const query = util.promisify(con.query).bind(con);

        var query1 = "SELECT equipa1,equipa2 FROM esporte_coletivo_adversarios WHERE evento_c = "+eventoID+""
        
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
                    
                }
            }catch(err){

            }

            return equipas
        }catch(err){
            console.log(err)
        }  
    },

    async getOddsTipoDeAposta(tipoDeAposta, eventoID){
        const query = util.promisify(con.query).bind(con);

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
        var query1 = "SELECT * FROM "+tipoDeAposta+" WHERE evento_"+tipoDeAposta+" = "+eventoID
        
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

    async createTeam(nomeEquipa){
        const query = util.promisify(con.query).bind(con);

        var query1 = "INSERT INTO equipa (nome) VALUES ('"+nomeEquipa+"')"
        
        try{
            var rows = await query(query1)
            return rows["insertId"]
        } catch(err){
            console.log(err)
        }
    },

    async checkIfTeamExist(nomeEquipa){
        const query = util.promisify(con.query).bind(con);

        var query1 = "SELECT * FROM equipa WHERE nome = '"+nomeEquipa+"'"
        
        try{
            var rows = await query(query1)
            if (rows.length > 0){
                return rows[0].idEquipa
            }else{
                return null
            }
        } catch(err){
            console.log(err)
        }
    }
}

module.exports = helpers