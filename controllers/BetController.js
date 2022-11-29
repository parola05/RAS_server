var BetModel = require('../models/BetModel')
var UserModel = require('../models/UserModel')
var EventModel = require('../models/EventModel')
const JWT = require('jsonwebtoken')

module.exports = {
    async addBuletin(req,res){
        var bets = req.body.bets
        var user = JWT.verify(req.header('authorization').substring(7), "Rasbet"); 
        var gain = req.body.gain 
        var type = req.body.type 
        var amount = req.body.amount 

        if (!bets || !user || !gain || !type || !amount ) {
            res.status(400).json({msg:"erro na requisição"})
        }

        //console.log(req.body)

        try{
            console.log("Indo adicionar Boletim vazio!")
            const buletinID = await BetModel.addBuletin(amount,gain,type,user.userID)
            console.log("Indo pegar tipo do boletim!")
            const buletinType = await EventModel.getBuletinType(buletinID)
            console.log("Tipo ",buletinType)
            console.log("Indo adicionar apostas do boletim!")
            await BetModel.addBetsFromBuletin(bets,buletinID,buletinType)
            console.log("Indo pegar saldo do utilizador")
            var userBalance =  (await UserModel.getUserData(user.userID)).balance 
            console.log(userBalance)
            console.log("Indo atualizar saldo do utilizador")
            await UserModel.setUserBalance(userBalance - amount,user.userID)
            console.log("Indo criar transação")
            await UserModel.addUserTransaction("be",amount,user.userID)
            res.status(200)
        }catch(error){
            res.status(400).json({msg:error})
        }
    },

    async getBuletinsFromUser(req,res){
        var user = JWT.verify(req.header('authorization').substring(7), "Rasbet"); 

        if (!user) {
            res.status(400).json({msg:"erro na requisição"})
        }

        try{
            const buletins = await BetModel.getBuletinsFromUser(user.userID)
            res.status(200).json({boletins: buletins})
        }catch(error){
            res.status(400).json({msg:error})
        }
    },

    async getBetsFromBuletin(req,res){
        var buletinID = req.body.buletinID

        if (!buletinID) {
            res.status(400).json({msg:"erro na requisição"})
        }

        console.log("Fui requisitado!2")

        try{
            const betsFromBuletin = await BetModel.getBetsFromBuletin(buletinID)

            var coletiveBets = []
            var dualBets = []
            for (var bet of betsFromBuletin){
                var betJson = {}
                betJson["oddSelected"] = bet["odd_selected"]

                const sportID = await EventModel.getSportFromEvent(bet["evento"])
                const sportType = await EventModel.getSportType(sportID)

                if(sportType == "c"){
                    betJson["evento"] = await EventModel.getTeamsFromColetiveEvent(bet["evento"])
                    coletiveBets.push(betJson) 
                }else if(sportType == "d"){
                    betJson["evento"] = await EventModel.getPlayersFromDualEvent(bet["evento"]) 
                    dualBets.push(betJson)
                }else if(sportType == "i"){

                }
            }

            var resJson = {}
            resJson["betsColetiveSports"] = coletiveBets
            resJson["betsDualSports"] = dualBets

            res.status(200).json({apostas:resJson})
        }catch(error){
            res.status(400).json({msg:error})
        }
    },
}