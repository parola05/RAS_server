const JWT = require('jsonwebtoken')
const EventLNFacade_ = require('../business/event_subsystem/EventLNFacade')
const EventLNFacade = new EventLNFacade_()
var axios = require('axios');

module.exports = {

    
    async setEventState(req,res){
        var description = req.body.description 
        var eventID = req.body.eventID  
        var state = req.body.state

        if (!description || !eventID || !state) {
            res.status(400).json({msg:"erro na requisição"})
        }

        try{
            console.log("[INVOCAR] EventLNFacade.setEventState")
            await EventLNFacade.setEventState(state, eventID, description)
            res.status(200).json({msg:"sucesso"})
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
            console.log("[INVOCAR] EventLNFacade.addSport")
            await EventLNFacade.addSport(name,type)
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
            console.log("[INVOCAR] EventLNFacade.addTeam")
            await EventLNFacade.addTeam(name)
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
            console.log("[INVOCAR] EventLNFacade.addPlayer")
            await EventLNFacade.addPlayer(name)
            res.status(200)
        }catch(error){
            res.status(400).json({msg:error})
        }    
    },

    
    async getTeams(req,res){
        try{
            const teams = await EventLNFacade.getTeams()
            res.status(200).json({teams:teams})
        }catch(error){
            res.status(400).json({msg:error})
        }
    },

    
    async getPlayers(req,res){
        try{
            const players = await EventLNFacade.getPlayers()
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
            EventLNFacade.addEventColetive(data,desportoID,equipa1ID,equipa2ID,tipoDeApostas)
            res.status(200).json({msg:"sucesso"})
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
            EventLNFacade.addEventDual(data,desportoID,jogador1ID,jogador2ID,tipoDeApostas)
            res.status(200).json({msg:"sucesso"})
        }catch(error){
            console.log(error)
            res.status(400).json({msg:error})
        }
    },

    
    async createBetType(req,res){
        var betTypeName = req.body.betTypeName
        var oddNames = req.body.oddNames
        var sportsID = req.body.sportsID
  
        if(!betTypeName || !oddNames || !sportsID) {
            res.status(400).json({msg:"erro na requisição"})
            return 
        }

        try{
            console.log("[INVOCAR] EventLNFacade.createBetType")
            await EventLNFacade.createBetType(betTypeName,oddNames,sportsID)
            console.log("[INVOCAR] res.status(200)")
            res.status(200).json({msg:"sucesso"})
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

        try{
            console.log("[INVOCAR] EventLNFacade.getEventsBySport")
            const events = await EventLNFacade.getEventsBySport(sportID)
            console.log("[INVOCAR] rest.status(200) with " + events)
            res.status(200).json({eventos: events})
        }catch(error){
            res.status(400).json({msg:error})
        }
    },

    
    async getSports(req,res){
        try{
            console.log("[INVOCAR] this.EventLNFacade.getSport")
            var sports = await EventLNFacade.getSports()
            console.log("[INVOCAR] rest.status(200)")
            res.status(200).json({esportes:sports})
        }catch(error){
            res.status(400).json({msg:error})
        }    
    },

    
    async addPromotion(req,res){
        var minAmount = req.body.minAmount 
        var expDate = req.body.expDate
        var perElevation = req.body.perElevation 
        var eventID = req.body.eventID 

        if (!minAmount || !expDate || !perElevation || !eventID) {
            res.status(400).json({msg:"erro na requisição"})
        }

        try{
            console.log("[INVOCAR] EventLNFacade.addPromotion")
            await EventLNFacade.addPromotion(minAmount,expDate,perElevation,eventID)
            res.status(200).json({msg:"sucesso"})
        }catch(error){
            res.status(400).json({msg:error})
        }
    },

    
    async follow(req,res){
        var eventID = req.body.eventID
        var user = JWT.verify(req.header('authorization').substring(7), "Rasbet"); 

        if (!eventID || !user) {
            res.status(400).json({msg:"erro na requisição"})
        }

        try{
            console.log("[INVOCAR] EventLNFacade.follow")
            await EventLNFacade.follow(eventID,user.userID)
            res.status(200).json({msg:"sucesso"})
        }catch(error){
            res.status(400).json({msg:error})
        }
    },

    
    async follow_cancel(req,res){
        var eventID = req.body.eventID
        var user = JWT.verify(req.header('authorization').substring(7), "Rasbet"); 

        if (!eventID || !user) {
            res.status(400).json({msg:"erro na requisição"})
        }

        try{
            console.log("[INVOCAR] EventLNFacade.follow_cancel")
            await EventLNFacade.follow_cancel(eventID,user.userID)
            res.status(200).json({msg:"sucesso"})
        }catch(error){
            res.status(400).json({msg:error})
        }
    },

    
    async follows(req,res){
        var user = JWT.verify(req.header('authorization').substring(7), "Rasbet"); 

        if (!user) {
            res.status(400).json({msg:"erro na requisição"})
        }

        try{
            const events = await EventLNFacade.follows(user.userID)
            res.status(200).json({events:events})
        }catch(error){
            res.status(400).json({msg:error})
        }
    },

    
    async updateEventOdds(req,res){
        var event = req.body.event

        if (!event) {
            res.status(400).json({msg:"erro na requisição"})
        }  
        
        try{
            console.log("[INVOCAR] EventLNFacade.updateEventOdds")
            await EventLNFacade.updateEventOdds(event["eventID"],event["betTypeList"])
            res.status(200).json({msg:"sucesso"})
        }catch(error){
            res.status(400).json({msg:error})
        }
    },

    
    async getBetTypeStructureBySport(req,res){
        var sportID = req.body.desportoID

        if(!sportID){
            res.status(400).json({msg:"erro na requisição"})   
        }

        try{
            console.log("[INVOCAR] EventLNFacade.getBetTypeStructureBySport")
            const listaTipoDeApostas = await EventLNFacade.getBetTypeStructureBySport(sportID)
            res.status(200).json({estrutura: listaTipoDeApostas})
        }catch(error){
            res.status(400).json({msg:error})   
        }
    },

    
    async getEventsOthersHouses(req,res){
        console.log("[INVOCAR] getEventsOtherHouses")
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