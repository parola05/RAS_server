var EventModel = require('../models/EventModel')
var UserModel = require('../models/UserModel')
var axios = require('axios');

module.exports = {
    async setEventState(req,res){
        var state = req.body.state 
        var eventID = req.body.eventID  

        if (!state || !eventID) {
            res.status(400).json({msg:"erro na requisição"})
        }

        try{
            await EventModel.setEventState(state,eventID)
            res.status(200)
        }catch(error){
            res.status(400).json({msg:error})
        }
    },

    async suspendEvent(req,res){
        var suspendText = req.body.suspendText 
        var eventID = req.body.eventID  

        if (!suspendText || !eventID) {
            res.status(400).json({msg:"erro na requisição"})
        }

        try{
            console.log("Indo alterar estado")
            await EventModel.setEventState("s",eventID)
            console.log("Indo criar notificação")
            await UserModel.addAllUsersNotification(
                "Evento suspenso",
                suspendText
            )
            res.status(200)
        }catch(error){
            res.status(400).json({msg:error})
        }
    },

    async addSport(req,res){
        var name = req.body.name 
        var type = req.body.type  

        if (!name || !type) {
            res.status(400).json({msg:"erro na requisição"})
        }

        try{
            await EventModel.addSport(name,type)
            res.status(200)
        }catch(error){
            res.status(400).json({msg:error})
        }
    },

    async addTeam(req,res){
        var name = req.body.name 

        if (!name) {
            res.status(400).json({msg:"erro na requisição"})
            return
        }

        try{
            await EventModel.addTeam(name)
            res.status(200)
        }catch(error){
            res.status(400).json({msg:error})
        }
    },

    async addPlayer(req,res){
        var name = req.body.name 

        if (!name) {
            res.status(400).json({msg:"erro na requisição"})
        }

        try{
            await EventModel.addPlayer(name)
            res.status(200)
        }catch(error){
            res.status(400).json({msg:error})
        }
    },

    async getTeams(req,res){
        try{
            var teams = await EventModel.getTeams()
            res.status(200).json({teams:teams})
        }catch(error){
            res.status(400).json({msg:error})
        }
    },

    async getPlayers(req,res){
        try{
            var players = await EventModel.getPlayers()
            res.status(200).json({players:players})
        }catch(error){
            res.status(400).json({msg:error})
        }
    },

    async addEventColetive(req,res){
        
        var equipa1ID = req.body.equipa1ID
        var equipa2ID = req.body.equipa2ID 
        var desportoID = req.body.desportoID 
        var data = req.body.data 
        var tipoDeApostas = req.body.tipoDeApostas

        if(!equipa1ID || !equipa2ID || !desportoID || !data || !tipoDeApostas) {
            res.status(400).json({msg:"erro na requisição"})
            return 
        }

        try{
            console.log("Indo criar evento!")
            const eventID = await EventModel.addEvent(data,desportoID)
            
            console.log("Indo criar participantes!")
            await EventModel.addColetiveSportParticipants(equipa1ID,equipa2ID,eventID)

            console.log("Indo criar tipos de apostas!")
            await tipoDeApostas.forEach(async (tipoDeAposta) => {
                await EventModel.addBetType(tipoDeAposta["nome"],tipoDeAposta["oddList"],eventID)
            })

            res.status(200)
        }catch(error){
            console.log(error)
            res.status(400).json({msg:error})
        }
    },

    async addEventDual(req,res){
        
        var jogador1ID = req.body.jogador1ID
        var jogador2ID = req.body.jogador2ID 
        var desportoID = req.body.desportoID 
        var data = req.body.data 
        var tipoDeApostas = req.body.tipoDeApostas

        if(!jogador1ID || !jogador2ID || !desportoID || !data || !tipoDeApostas) {
            res.status(400).json({msg:"erro na requisição"})
            return 
        }

        try{
            console.log("Indo criar evento!")
            const eventID = await EventModel.addEvent(data,desportoID)
            
            console.log("Indo criar participantes!")
            await EventModel.addDualSportParticipants(jogador1ID,jogador2ID,eventID)

            console.log("Indo criar tipos de apostas!")
            await tipoDeApostas.forEach(async (tipoDeAposta) => {
                await EventModel.addBetType(tipoDeAposta["nome"],tipoDeAposta["oddList"],eventID)
            })

            res.status(200)
        }catch(error){
            console.log(error)
            res.status(400).json({msg:error})
        }
    },

    async createBetType(req,res){
        console.log(req.body)
        var betTypeName = req.body.betTypeName
        var oddNames = req.body.oddNames
        var sportsID = req.body.sportsID
  
        if(!betTypeName || !oddNames || !sportsID) {
            res.status(400).json({msg:"erro na requisição"})
            return 
        }

        try{
            await EventModel.createBetType(betTypeName,oddNames)
            await EventModel.addBetTypeToSports(sportsID,betTypeName)
            res.status(200)
        }catch(error){
            res.status(400).json({msg:error})
        }
    },

    async getEventsBySport(req,res){
        var sportID = req.body.sportID 

        if(!sportID) {
            res.status(400).json({msg:"erro na requisição"})
            return 
        }

        var eventos = await EventModel.getEventsBySport(sportID)
        
        var tiposDeAposta = await EventModel.getBetTypeBySport(sportID)

        var sportType = await EventModel.getSportType(sportID)


        if(sportType == "c"){

            var equipasEventos = []
            for (var evento of eventos){
                equipasEventos.push(await EventModel.getTeamsFromColetiveEvent(evento["idevent"]))
            }

            var tiposDeApostasComOddsDeCadaEvento = []
            for (var evento of eventos){
                var eventoID = evento["idevent"]
     
                var tiposDeApostasComOdds = []
                
                for (var tipoDeAposta of tiposDeAposta){
                    tiposDeApostasComOdds.push(await EventModel.getOddsTipoDeAposta(tipoDeAposta,eventoID))
                }
        
                tiposDeApostasComOddsDeCadaEvento.push(tiposDeApostasComOdds)
                console.log(tiposDeApostasComOdds)
            }


            var resJson = {}
            resJson["eventos"] = []
            var iter = 0
            for (var evento of eventos){
              var eventoID = evento["idevent"]
              var equipa1Nome = equipasEventos[iter]["equipa1Nome"]
              var equipa2Nome = equipasEventos[iter]["equipa2Nome"]
              var date = evento["date"]
              var state = evento["state"]
              var sport = evento["sport"]
      
              var tiposDeApostaJson = []
      
              var iter2 = 0
              for (var tipoDeAposta of tiposDeApostasComOddsDeCadaEvento[iter]){
                var listaDeOdds = []
      
                for (var odd of tiposDeApostasComOddsDeCadaEvento[iter][iter2]){
                  listaDeOdds.push({nome:odd["nome"],valor:odd["valor"]})
                  //console.log(listaDeOdds)
                }
      
                tiposDeApostaJson.push({nome: tiposDeAposta[iter2], listaDeOdds:listaDeOdds})
                iter2++
              }
              
              var evento = {eventoID: eventoID, sportID: sport, equipa1Nome: equipa1Nome, equipa2Nome: equipa2Nome, date: date, state: state, tipoDeApostas: tiposDeApostaJson}
              resJson["eventos"][iter] = evento
      
              iter++
            }
            
            res.status(200).json({eventos:resJson["eventos"]})
      
        }else if(sportType == "d"){
            var jogadoresEventos = []
            for (var evento of eventos){
                jogadoresEventos.push(await EventModel.getPlayersFromDualEvent(evento["idevent"]))
            }
            
            var tiposDeApostasComOddsDeCadaEvento = []
            for (var evento of eventos){
                var eventoID = evento["idevent"]
     
                var tiposDeApostasComOdds = []
                
                for (var tipoDeAposta of tiposDeAposta){
                    tiposDeApostasComOdds.push(await EventModel.getOddsTipoDeAposta(tipoDeAposta,eventoID))
                }
        
                tiposDeApostasComOddsDeCadaEvento.push(tiposDeApostasComOdds)
                console.log(tiposDeApostasComOdds)
            }


            var resJson = {}
            resJson["eventos"] = []
            var iter = 0
            for (var evento of eventos){
              var eventoID = evento["idevent"]
              var jogador1Nome = jogadoresEventos[iter]["jogador1Nome"]
              var jogador2Nome = jogadoresEventos[iter]["jogador2Nome"]
              var date = evento["date"]
              var state = evento["state"]
              var sport = evento["sport"]
      
              var tiposDeApostaJson = []
      
              var iter2 = 0
              for (var tipoDeAposta of tiposDeApostasComOddsDeCadaEvento[iter]){
                var listaDeOdds = []
      
                for (var odd of tiposDeApostasComOddsDeCadaEvento[iter][iter2]){
                  listaDeOdds.push({nome:odd["nome"],valor:odd["valor"]})
                  //console.log(listaDeOdds)
                }
      
                tiposDeApostaJson.push({nome: tiposDeAposta[iter2], listaDeOdds:listaDeOdds})
                iter2++
              }
              
              var evento = {eventoID: eventoID, sportID: sport,jogador1Nome: jogador1Nome, jogador2Nome: jogador2Nome, date: date, state: state, tipoDeApostas: tiposDeApostaJson}
              resJson["eventos"][iter] = evento
      
              iter++
            }
            
            res.status(200).json({eventos:resJson["eventos"]})
        }else if(sportType == "i"){

        }    
    },

    async getSports(req,res){
        try{
            var sports = await EventModel.getSports()
            res.status(200).json({esportes:sports})
        }catch(error){
            res.status(400).json({msg:error})
        }    
    },

    async addResult(req,res){
        const eventID = req.body.eventID
        const betTypeList = req.body.betTypeList 
        
        if(!eventID || !betTypeList){
            res.status(400).json({msg:"erro na requisição"})   
        }

        try{
            const betsFromEvent = await EventModel.getBetsWaitingFromEvent(eventID)
            
            for(const betFromEvent of betsFromEvent){
                const betHappens = EventModel.checkIfBetHappens(betFromEvent.odd_selected,betTypeList)

                if(betHappens){
                    await EventModel.setBetState(betFromEvent.idbet,"h")
                    const buletinType = await EventModel.getBuletinType(betFromEvent.buletin)
                
                    if(buletinType == "m"){
                        console.log("Indo checkar se o boletim múltiplo foi concluído com sucesso")
                        const buletinSuccess = await EventModel.checkIfBuletinMSuccess(betFromEvent.buletin)

                        if(buletinSuccess){
                            console.log("Indo pegar utilizador do boletim!")
                            const userFromBuletin = await EventModel.getUserFromBuletin(betFromEvent.buletin) 
                            console.log("Indo pegar saldo do utilizador")
                            const userBalance =  (await UserModel.getUserData(userFromBuletin)).balance 
                            console.log("Indo pegar ganho total do boletim")
                            const buletinGain = await EventModel.getBuletinGain(betFromEvent.buletin) 
                            console.log("Indo atualizar saldo do utilizador")
                            await UserModel.setUserBalance(userBalance + buletinGain,userFromBuletin)
                            console.log("Indo criar transação")
                            await UserModel.addUserTransaction("ga",buletinGain,userFromBuletin)
                            console.log("Indo criar notificação")
                            await UserModel.addUserNotification(
                                "Ganho de aposta",
                                "Parabéns, você ganhou uma aposta! " + buletinGain + "$ foi despositado na sua conta!",
                                userFromBuletin
                            )
                        }
                    }else if(buletinType == "s"){
                        console.log("Indo pegar utilizador do boletim!")
                        const userFromBuletin = await EventModel.getUserFromBuletin(betFromEvent.buletin) 
                        console.log("Indo pegar saldo do utilizador")
                        const userBalance =  (await UserModel.getUserData(userFromBuletin)).balance 
                        console.log("Indo atualizar saldo do utilizador")
                        await UserModel.setUserBalance(userBalance + betFromEvent.gain,userFromBuletin)
                        console.log("Indo criar transação")
                        await UserModel.addUserTransaction("ga",betFromEvent.gain,userFromBuletin)
                        console.log("Indo criar notificação")
                        await UserModel.addUserNotification(
                            "Ganho de aposta",
                            "Parabéns, você ganhou uma aposta! " + betFromEvent.gain + "$ foi despositado na sua conta!",
                            userFromBuletin
                        )
                    }
                }else{
                    await EventModel.setBetState(betFromEvent.idbet,"n")
                }
            }
        }catch(error){
            res.status(400).json({msg:error})
        }
    },

    async getBetTypeStructureBySport(req,res){
        listaTipoDeApostas = []
        var sportID = req.body.desportoID

        if(!sportID){
            res.status(400).json({msg:"erro na requisição"})   
        }

        try{
            const betTypes = await EventModel.getBetTypeBySport(sportID)
            
            for (const tipoDeAposta of betTypes){

                var tipoDeApostaJson = {}
                tipoDeApostaJson["nome"] = tipoDeAposta
              
                var listaDeOdds = await EventModel.getOddListFromBetType(tipoDeAposta)
      
                tipoDeApostaJson["listaDeOdds"] = listaDeOdds

                listaTipoDeApostas.push(tipoDeApostaJson)
            }

            res.status(200).json({estrutura: listaTipoDeApostas})
      
        }catch(error){
            res.status(400).json({msg:error})   
        }
    },

    async getEventsOthersHouses(req,res){
        var events = await axios.get("http://ucras.di.uminho.pt/v1/games/")
      
        var houses = []
        var iter = 0 
        for(var event of events.data){
            if (iter == 0){
            var bookMarker = event["bookmakers"]
            for (var house of bookMarker){
                houses.push(house["key"])
            }
            }
            iter++
        }

        var jsonResul = []
        for (var house of houses){
            var eventHouse = {}
            eventHouse["casa"] = house 
            eventHouse["eventos"] = []

            for(var event of events.data){
            var evento = {}
            evento["equipa1Nome"] = event["awayTeam"]
            evento["equipa2Nome"] = event["homeTeam"]

            var tipoDeApostaL = []
            var tipoDeAposta = {}
            tipoDeAposta["nome"] = "apostaAPI"
            tipoDeAposta["listaDeOdds"] = []
            evento["tipoDeApostas"] 
            var bookMarker = event["bookmakers"]
            
            for (var bm of bookMarker){
                if(bm["key"] == house){
                var markets = bm["markets"]
                for (var m of markets){
                    var outcomes = m["outcomes"]

                    for(var o of outcomes){
                    var odd = {}
                    odd["nome"] = o["name"]
                    odd["valor"] = o["price"]
                    tipoDeAposta["listaDeOdds"].push(odd)
                    }
                }
                }
            }

            tipoDeApostaL.push(tipoDeAposta)
            evento["tipoDeApostas"] = tipoDeApostaL
            eventHouse["eventos"].push(evento)
            } 
            jsonResul.push(eventHouse)
        }

      res.status(200).json({jsonResul})
    }
}