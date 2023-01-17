var con = require('../../config/db')
const util = require('util');
const query = util.promisify(con.query).bind(con);

var EventFollowersDAO = require('./EventFollowersDAO')

module.exports = class EventDAO {

    observers = []
    eventFollowersDAO = null

    constructor(){
        this.eventFollowersDAO = new EventFollowersDAO()        
    }

    registerObserver(observer){
        console.log("[INVOCAR] this.observers.push with " + observer)
        this.observers.push(observer)
    }

    removeObserver(observer){
        this.observers.splice(this.observers.findIndex(observer),1)
    }

    async notifyAll(users, title, description){
        console.log("[INVOCAR] for (o of this.observers) with " + this.observers.length)
        for (const o of this.observers){
            console.log("[INVOCAR] typeof(o.pudate) == function")
            if (typeof(o.update) == "function"){
                console.log("[INVOCAR] update()")
                await o.update(users, title, description)
            }
        }
    }

    async setEventState(state,eventID,description){
        console.log("[INVOCAR] setEventState_")
        await this.setEventState_(state,eventID)
        console.log("[INVOCAR] this.eventFollowersDAO.getFollowers")
        const users = await this.eventFollowersDAO.getFollowersByEvent(eventID)
        console.log("[INVOCAR] notifyAll with " + users)
        this.notifyAll(users,"Evento " + state, description)
    }

    async setEventState_(state,eventID){
        console.log("[INVOCAR] query1")
        const query1 = "UPDATE evento SET state = '"+state+"' WHERE idevent = '"+eventID+"';"

        try{
            await query(query1)
        }catch(err){
            throw Error("Erro em conectar com base de dados") 
        }
    }

    async addEvent(date,desportoID){
        console.log("[INVOCAR] query1")
        var query1 = "INSERT INTO evento (date, state, esporte_e) VALUES ('"+date+"','o',"+desportoID+")"

        try{
            var result = await query(query1)
            return result.insertId
        }catch(err){
            throw Error("Erro em conectar com base de dados") 
        }
    }

    async addBetType(nomeTipoDeAposta,listaDeOdds,eventID){

        var listaDeOddsNomes = "("
        var listaDeOddsValores = "("
        
        listaDeOdds.forEach((odd) =>{
            listaDeOddsNomes = listaDeOddsNomes + "`" + odd["nome"] + "`,"
            listaDeOddsValores = listaDeOddsValores + odd["odd"] + ","
        })
                
        listaDeOddsNomes = listaDeOddsNomes + "`evento_" + nomeTipoDeAposta + "`)"
        listaDeOddsValores = listaDeOddsValores + eventID + ")"

        console.log("[INVOCAR] query1")
        var query1 = "INSERT INTO `"+nomeTipoDeAposta+"` "+listaDeOddsNomes+" VALUES "+listaDeOddsValores
        
        try{
            await query(query1)
        }catch(err){
            console.log(err)
            throw Error("Erro em conectar com base de dados") 
        }
    }

    async updateBetType(eventID,betTypeList){
        console.log("[INVOCAR] eventDAO.updateBetType in for")
        for (var betType of betTypeList){
            if (betType["oddList"].length > 0){
                this.updateBetType_(betType["nome"],betType["oddList"],eventID)
            }
        }
        console.log("[INVOCAR] this.eventFollowersDAO.getFollowers")
        const users = await this.eventFollowersDAO.getFollowersByEvent(eventID)
        console.log("[INVOCAR] notifyAll with " + users)
        this.notifyAll(users,"Evento " + eventID, "Odds atualizadas!")
    }

    async updateBetType_(nomeTipoDeAposta,listaDeOdds,eventID){

        var listaDeOddsNomes = ""
        
        listaDeOdds.forEach((odd) =>{
            listaDeOddsNomes = listaDeOddsNomes + "`" + odd["nome"] + "` = "+odd["odd"] + ","
        })

        listaDeOddsNomes = listaDeOddsNomes.substring(0, listaDeOddsNomes.length-1);
                
        console.log("[INVOCAR] query1")
        var query1 = "UPDATE `"+nomeTipoDeAposta+"` SET "+listaDeOddsNomes+" WHERE `evento_"+nomeTipoDeAposta+"` = " +eventID + ";"

        console.log(query1)
        
        try{
            await query(query1)
        }catch(err){
            console.log(err)
            throw Error("Erro em conectar com base de dados") 
        }
    }

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

        console.log("[INVOCAR] query1")
        try{
            await query(query1)
        }catch(err){
            throw Error("Erro em conectar com base de dados") 
        }
    }

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
    }

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
            for (const contentRow of rows){
                for (const coluna of nomeColunas){
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
    }

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