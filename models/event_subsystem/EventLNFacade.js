var EventDAO = require('./EventDAO')
var PlayerDAO = require('./PlayerDAO')
var SportDAO = require('./SportDAO')
var CollectiveSportOpponentsDAO = require('./CollectiveSportOpponentsDAO')
var DualSportOpponentsDAO = require('./DualSportOpponentsDAO')
var SportBetTypesDAO = require('./SportBetTypesDAO')
var TeamDAO = require('./TeamDAO')
var NotificationDAO = require('../user_subsystem/NotificationDAO')
var PromotionDAO = require('./PromotionDAO')
var EventFollowersDAO = require('./EventFollowersDAO')

class EventLNFacade {
    eventDAO = null
    playerDAO = null 
    sportDAO = null 
    teamDAO = null
    collectiveSportOpponentsDAO = null
    dualSportOpponentsDAO = null
    notificationDAO = null
    sportBetTypesDAO = null
    promotionDAO = null
    eventFollowersDAO = null

    constructor(){
        this.eventDAO = new EventDAO()
        this.promotionDAO = new PromotionDAO
        var notificationSubjects = []
        notificationSubjects.push(this.eventDAO)
        notificationSubjects.push(this.promotionDAO)
        this.notificationDAO = new NotificationDAO(notificationSubjects)
        this.playerDAO = new PlayerDAO()
        this.sportDAO = new SportDAO()
        this.teamDAO = new TeamDAO()
        this.collectiveSportOpponentsDAO = new CollectiveSportOpponentsDAO()
        this.dualSportOpponentsDAO = new DualSportOpponentsDAO()
        this.sportBetTypesDAO = new SportBetTypesDAO()
        this.eventFollowersDAO = new EventFollowersDAO()
    }

    async setEventState(state,eventID,description){
        console.log("[INVOCAR] this.eventDAO.setEventState")
        await this.eventDAO.setEventState(state,eventID,description)
    }

    async addSport(name,type){
        console.log("[INVOCAR] this.sportDAO.addSport")
        await this.sportDAO.addSport(name,type)
    }

    async addTeam(name){
        console.log("[INVOCAR] this.teamDAO.addTeam")
        await this.teamDAO.addTeam(name)
    }

    async addPlayer(name){
        console.log("[INVOCAR] this.playerDAO.addPlayer")
        await this.playerDAO.addPlayer(name)
    }

    async getTeams(){
        console.log("[INVOCAR] this.teamDAO.getTeams")
        return await this.teamDAO.getTeams()
    }

    async getPlayers(){
        console.log("[INVOCAR] this.playerDAO.getPlayers")
        return await this.playerDAO.getPlayers()
    }

    async addEventColetive(data,desportoID,equipa1ID,equipa2ID,tipoDeApostas){
        
        console.log("[INVOCAR] this.eventDAO.addEvent")
        const eventID = await this.eventDAO.addEvent(data,desportoID)
        console.log("[INVOCAR] this.dualSportOpponentsDAO.addDualSportParticipants with " + eventID)
        await this.collectiveSportOpponentsDAO.addColetiveSportParticipants(equipa1ID,equipa2ID,eventID)

        console.log("[INVOCAR] tipoDeApostas.forEach")
        await tipoDeApostas.forEach(async (tipoDeAposta) => {
            await this.eventDAO.addBetType(tipoDeAposta["nome"],tipoDeAposta["oddList"],eventID)
        })
    }

    async addEventDual(data,desportoID,jogador1ID,jogador2ID,tipoDeApostas){
        console.log("[INVOCAR] this.eventDAO.addEvent")
        const eventID = await this.eventDAO.addEvent(data,desportoID)
        console.log("[INVOCAR] this.dualSportOpponentsDAO.addDualSportParticipants with " + eventID)
        await this.dualSportOpponentsDAO.addDualSportParticipants(jogador1ID,jogador2ID,eventID)

        console.log("[INVOCAR] tipoDeApostas.forEach")
        await tipoDeApostas.forEach(async (tipoDeAposta) => {
            await this.eventDAO.addBetType(tipoDeAposta["nome"],tipoDeAposta["oddList"],eventID)
        })
    }

    async createBetType(betTypeName,oddNames,sportsID){
        console.log("[INVOCAR] this.eventDAO.createBetType")
        await this.eventDAO.createBetType(betTypeName,oddNames)
        console.log("[INVOCAR] this.sportBetTypesDAO.addBetTypeToSports")
        await this.sportBetTypesDAO.addBetTypeToSports(sportsID,betTypeName)
    }

    async getEventsBySport(sportID){

        console.log("[INVOCAR] this.eventDAO.getEventsBySport")
        var eventos = await this.eventDAO.getEventsBySport(sportID) // [TESTED]
        console.log("[INVOCAR] this.sportBetTypesDAO.getBetTypeBySport")
        var tiposDeAposta = await this.sportBetTypesDAO.getBetTypeBySport(sportID) // [TESTED]
        console.log("[INVOCAR] this.sportDAO.getSportType")
        var sportType = await this.sportDAO.getSportType(sportID) // [TESTED]

        if(sportType == "c"){

            var equipasEventos = []
            console.log("[INVOCAR] this.collectiveSportOpponentsDAO.getTeamsFromColetiveEvent")
            for (var evento of eventos){
                equipasEventos.push(await this.collectiveSportOpponentsDAO.getTeamsFromColetiveEvent(evento["idevent"])) // [TESTED]
            }

            var tiposDeApostasComOddsDeCadaEvento = []
            console.log("[INVOCAR] this.eventDAO.getOddsTipoDeAposta")
            for (var evento of eventos){
                var eventoID = evento["idevent"]
     
                var tiposDeApostasComOdds = []
                
                for (var tipoDeAposta of tiposDeAposta){
                    tiposDeApostasComOdds.push(await this.eventDAO.getOddsTipoDeAposta(tipoDeAposta,eventoID)) // [TESTED]
                }
        
                tiposDeApostasComOddsDeCadaEvento.push(tiposDeApostasComOdds)
                //console.log(tiposDeApostasComOdds)
            }

            console.log("[INVOCAR] this.promotionDAO.getEventPromotion")
            var resJson = {}
            resJson["eventos"] = []
            var iter = 0
            for (var evento of eventos){
              var eventoID = evento["idevent"]
              var promotion = await this.promotionDAO.getEventPromotion(eventoID)
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
              
              var evento = {eventoID: eventoID, sportID: sport, equipa1Nome: equipa1Nome, equipa2Nome: equipa2Nome, date: date, state: state, tipoDeApostas: tiposDeApostaJson,promotion:promotion}
              resJson["eventos"][iter] = evento
      
              iter++
            }
            
            return resJson["eventos"]
      
        }else if(sportType == "d"){
            var jogadoresEventos = []
            for (var evento of eventos){
                jogadoresEventos.push(await this.dualSportOpponentsDAO.getPlayersFromDualEvent(evento["idevent"])) // [TESTED]
            }
            
            var tiposDeApostasComOddsDeCadaEvento = []
            for (var evento of eventos){
                var eventoID = evento["idevent"]
     
                var tiposDeApostasComOdds = []
                
                for (var tipoDeAposta of tiposDeAposta){
                    tiposDeApostasComOdds.push(await this.eventDAO.getOddsTipoDeAposta(tipoDeAposta,eventoID)) // [TESTED]
                }
        
                tiposDeApostasComOddsDeCadaEvento.push(tiposDeApostasComOdds)
                console.log(tiposDeApostasComOdds)
            }


            var resJson = {}
            resJson["eventos"] = []
            var iter = 0
            for (var evento of eventos){
              var eventoID = evento["idevent"]
              var promotion = await this.promotionDAO.getEventPromotion(eventoID) // [TESTED]
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
              
              var evento = {eventoID: eventoID, sportID: sport,jogador1Nome: jogador1Nome, jogador2Nome: jogador2Nome, date: date, state: state, tipoDeApostas: tiposDeApostaJson, promotion:promotion}
              resJson["eventos"][iter] = evento
      
              iter++
            }
            
            return resJson["eventos"]
        }else if(sportType == "i"){
            // TODO
        }    
    }

    async getSports(){
        console.log("[INVOCAR] this.eventDAO.getEventsBySport")
        return await this.sportDAO.getSports()
    }

    async addPromotion(minAmount,expDate,perElevation,eventID){
        console.log("[INVOCAR] this.promotionDAO.addPromotion")
        await this.promotionDAO.addPromotion(minAmount,expDate,perElevation,eventID);
    }

    // [TESTED]
    async follow(eventID,userID){
        console.log("[INVOCAR] this.eventFollowersDAO.addFollowerOfEvent")
        await this.eventFollowersDAO.addFollowerOfEvent(userID,eventID)
    }

    // [TESTED]
    async follow_cancel(eventID,userID){
        console.log("[INVOCAR] this.eventFollowersDAO.removeFollowerOfEvent")
        await this.eventFollowersDAO.removeFollowerOfEvent(userID,eventID)
    }

    // [TESTED]
    async follows(userID){
        console.log("[INVOCAR] this.eventFollowersDAO.getEventsByFollower")
        const events = await this.eventFollowersDAO.getEventsByFollower(userID)

        var collectiveTeams = []
        var collectiveIds = []
        var dualPlayers = []
        var dualIds = []
        
        for (const event of events){
            console.log("[INVOCAR] await this.eventDAO.getSportFromEvent")
            const sport = await this.eventDAO.getSportFromEvent(event)
            console.log("[INVOCAR] this.sportDAO.getSportType")
            const type = await this.sportDAO.getSportType(sport)

            if (type == "c"){
                console.log("[INVOCAR] this.collectiveSportOpponentsDAO.getTeamsFromColetiveEvent")
                collectiveTeams.push(await this.collectiveSportOpponentsDAO.getTeamsFromColetiveEvent(event)) // [TESTED]   
                collectiveIds.push(event)
            }

            if (type == "d"){
                console.log("[INVOCAR] this.dualSportOpponentsDAO.getPlayersFromDualEvent")
                dualPlayers.push(await this.dualSportOpponentsDAO.getPlayersFromDualEvent(event)) // [TESTED]
                dualIds.push(event)
            }
        }

        var jsonRes = {}
        jsonRes["collectiveTeams"] = collectiveTeams
        jsonRes["collectiveIds"] = collectiveIds
        jsonRes["dualPlayers"] = dualPlayers
        jsonRes["dualIds"] = dualIds

        console.log("RES", jsonRes)

        return jsonRes
    }

    // [IN TEST]
    async updateEventOdds(eventID,betTypeList){
        console.log("[INVOCAR] eventDAO.updateBetType")
        this.eventDAO.updateBetType(eventID,betTypeList)
    }
}

module.exports = EventLNFacade